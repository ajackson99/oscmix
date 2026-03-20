[![Build and Release](https://github.com/huddx01/oscmix/actions/workflows/build.yml/badge.svg?branch=dev)](https://github.com/huddx01/oscmix/actions/workflows/build.yml)

Hi, you have reached my dev branch which is a fork of https://github.com/michaelforney/oscmix.

> [!NOTE]
> My branch is NOT sponsored, authorized, endorsed, or associated with RME Audio in any way. This is an independent implementation created for educational purposes and to provide Linux (and macOS) support for the RME hardware.

> [!WARNING]
> Keep in mind that this content may be untested/experimental/wip state.
# oscmix
 
oscmix implements an OSC API for some RME's Fireface units running in
class-compliant mode, allowing full control of the device's
functionality through OSC on POSIX operating systems supporting USB
MIDI.

## Current status

Most things work, but still needs a lot more testing, polish,
cleanup. Some things still need to be hooked up in the UI or
implemented in oscmix.

### Supported devices

- RME Fireface UCX II

### Devices in WIP State

- RME Fireface 802
- RME Fireface UCX
- RME Fireface UFX+
- RME Fireface UFX II
- RME Fireface UFX III


## Download

Pre-Compiled binaries are available for arm64 and x86_64 architectures.
Each arch is available for linux and darwin (macOS).

Check the release section at: https://github.com/huddx01/oscmix/releases

## Building

If you prefer building your own from the sources, follow the steps below...

### 1. Install Dependencies

#### For Debian/Ubuntu:
```shell
sudo apt update
sudo apt install -y libasound2-dev pkg-config libgtk-3-dev libglib2.0-dev clang lld git
```
#### For Darwin(macOS):
**TODO** Document the dependencies for macOS here.

### 2. Download Repository
First, decide which repo/branch fits your needs/unit.

- 2a) If you want use this repo's dev branch:
```shell
git clone https://github.com/huddx01/oscmix.git
cd oscmix
git switch dev
```
- 2b) Or, if you want use 
[michaelforney](https://github.com/michaelforney)'s original repo: 
```shell
git clone https://github.com/michaelfourney/oscmix.git
cd oscmix
```

### 3. Build
From the oscmix dir, use make to build the binaries.
```shell
make oscmix
make alsaseqio
make alsarawio
make gtk
make tools/regtool
```
If you want to build the wasm too (needed for own webserver), you'll need additional dependencies. 
See: https://github.com/huddx01/oscmix/tree/dev?tab=readme-ov-file#web-ui

## General Oscmix Usage

```
oscmix [-dl] [-r recvaddr] [-s sendaddr]
```

oscmix reads and writes MIDI SysEx messages from/to file descriptors
6 and 7 respectively, which are expected to be opened.

By default, oscmix will listen for OSC messages on `udp!127.0.0.1!7222`
and send to `udp!127.0.0.1!8222`.

See the manual, [oscmix.1], for more information.

[oscmix.1]: https://michaelforney.github.io/oscmix/oscmix.1.html

## Running

### Linux

On Linux systems, you can use alsarawio or asaseqio to run oscmix.

#### 1. alsarawio

On Linux systems, you can use bundled `alsarawio` program open and
configure a given raw MIDI subdevice and set up these file descriptors
appropriately.

To determine your MIDI device, look for it in the output of `amidi -l`.
(the last ending port with the name `Fireface xyz...`).

Example:

```sh
$ amidi -l
Dir Device    Name
IO  hw:0,0,0  Fireface UFX III (xxxxxxxx) Por
IO  hw:0,0,1  Fireface UFX III (xxxxxxxx) Por
IO  hw:0,0,2  Fireface UFX III (xxxxxxxx) Por
IO  hw:0,0,3  Fireface UFX III (xxxxxxxx) Por
```

We use the last port from the result above to run oscmix:

```sh
alsarawio 0,0,3 oscmix
```


#### 2. alsaseqio

There is also a tool `alsaseqio` that requires alsa-lib and uses
the sequencer API.

To determine the client and port for your device, find the client
and the last port in the output of `aconnect -l` for your device.

Example:
```sh
$ aconnect -l
...
client 16: 'Fireface UFX III (xxxxxxxx)' [type=Kernel,card=0]
    0 'Fireface UFX III (xxxxxxxx) Por'
    1 'Fireface UFX III (xxxxxxxx) Por'
    2 'Fireface UFX III (xxxxxxxx) Por'
    3 'Fireface UFX III (xxxxxxxx) Por'
...
```
We use the client and last port from the result above to run oscmix:
```sh
alsaseqio 16:3 oscmix
```

### BSD

On BSD systems, you can launch oscmix with file descriptors 6 and
7 redirected to the appropriate MIDI device.

For example:

```sh
oscmix 6<>/dev/rmidi1 7>&6
```

### macOS (Darwin)

On macOS (Darwin) systems, you can build and launch oscmix, too.

At least, Xcode Command Line Tools are neccesary (not needed if you have Xcode installed). 

You can install the Xcode Command Line Tools via:

```sh
xcode-select --install
```

Afterwards, go to the cloned oscmix directory (assure you are on dev branch) and buid oscmix via:

```sh
make oscmix
```

Additionally you need to build coremidiio via: 

```sh
make coremidiio
```

If this is done, check your port number and remember the exact name of your unit:

```sh
./coremidiio -l
```

For example, if your unit would appear like this...
"4  	Fireface 802 (12345678) Port 2"
...the corresponding command would be:

```sh
./coremidiio -f 6,7 -p 4 ./oscmix -p 'Fireface 802 (12345678) Port 2'
```

> [!NOTE]
> You can also set MIDIPORT env variable to 'Fireface 802 (12345678) Port 2' in this example.


## GTK UI

The [gtk](gtk) directory contains oscmix-gtk, a GTK frontend that
communicates with oscmix using OSC.

<img width="1847" height="1073" alt="gtk" src="doc/gtk.png" />

### Running GTK UI
To run oscmix-gtk without installing, set the `GSETTINGS_SCHEMA_DIR`
environment variable.

```sh
GSETTINGS_SCHEMA_DIR=$PWD/gtk ./gtk/oscmix-gtk
```

## Qt UI *(Early WIP)*

> [!NOTE]
> This is a first rough draft after only a few hours of learning Qt -
> expect rough edges. Sources and binaries will follow once it's in a shareable state.

<img width="1261" height="874" alt="qt-preview" src="doc/qt-preview.png" />

Latest changes: 
- Big steps forwards today...
- Level meters finetuning
- Editable channel names
- And a lot under the hood...
- yeah, needs polish regarding colors/positioning/scaling etc...

### Why Qt?

- **Native experience** - proper window chrome, system fonts, and trackpad scrolling that GTK can't match on Linux and macOS
- **Universal Code** - no change of one single code line needed for building on each system (Linux/macOS/Windows). While the UI exacly looks the same on all. 
- **Open GL/Metal** - Qt supports direct graphics engine support for all systems, without further hassles...

### Your input wanted

This frontend is at the stage where your feedback shapes the direction. Two things are especially useful right now:

1. **What matters to you in the UI?** Missing controls, layout preferences, workflow details - just open an issue.
2. **GTK vs. Qt priority?** Development time is finite. If you actively use or plan to use the Qt frontend, let me know via issue - it directly influences where time goes.

## Web UI

The [web](web) directory contains a web frontend that can communicate
with oscmix through OSC over a WebSocket, or by directly to an
instance of oscmix compiled as WebAssembly running directly in the browser.

<img width="1930" height="1095" alt="oscmix-web" src="doc/webui.png" />


The web UI for this fork/dev branch is automatically deployed at
[https://huddx01.github.io/oscmix](https://huddx01.github.io/oscmix).

It is tested primarily against the chromium stable channel, but
patches to support other/older browsers are welcome (if it doesn't
complicate things too much).

Also included is a UDP-to-WebSocket bridge, `wsdgram`. It expects
file descriptors 0 and 1 to be an open connection to a WebSocket
client. It forwards incoming messages to a UDP address and writes
outgoing messages for any UDP packet received. Use it in combination
with software like [s6-tcpserver] or [s6-tlsserver].

```sh
s6-tcpserver 127.0.0.1 8222 wsdgram
```

To build `oscmix.wasm`, you need `clang` supporting wasm32, `wasm-ld`,
and `wasi-libc`.

[s6-tcpserver]: https://skarnet.org/software/s6-networking/s6-tcpserver.html
[s6-tlsserver]: https://skarnet.org/software/s6-networking/s6-tlsserver.html

## OSC API

The OSC API is not yet final and may change without notice.

Sub-trees marked with `[...]` have additional nodes documented further below.

### Inputs

| Method | Arguments | Description |
| --- | --- | --- |
| `/input/{n}/mute` | `i` 0/1 | Mute |
| `/input/{n}/fx` | `f` dB (-65.0–0.0) | FX send level |
| `/input/{n}/stereo` | `i` 0/1 | Stereo pair |
| `/input/{n}/record` | `i` 0/1 | Record enable |
| `/input/{n}/playchan` | `i` 1–60 | Play channel assign |
| `/input/{n}/msproc` | `i` 0/1 | M/S processing |
| `/input/{n}/phase` | `i` 0/1 | Phase invert |
| `/input/{n}/gain` | `f` dB | Preamp gain (device-dependent range) |
| `/input/{n}/reflevel` | `→ i  ← is` | Reference level (device-dependent enum) |
| `/input/{n}/48v` | `i` 0/1 | Phantom power |
| `/input/{n}/autoset` | `i` 0/1 | Auto-set gain |
| `/input/{n}/hi-z` | `i` 0/1 | Instrument / Hi-Z mode |
| `/input/{n}/name` | `s` | Channel name |
| `/input/{n}/lowcut` | `i` 0/1 | Low cut enable `[lowcut]` |
| `/input/{n}/eq` | `i` 0/1 | EQ enable `[eq]` |
| `/input/{n}/dynamics` | `i` 0/1 | Dynamics enable `[dynamics]` |
| `/input/{n}/autolevel` | `i` 0/1 | AutoLevel enable `[autolevel]` |

### Outputs

| Method | Arguments | Description |
| --- | --- | --- |
| `/output/{n}/volume` | `f` dB (-65.0–6.0) | Output volume |
| `/output/{n}/pan` | `i` -100–100 | Pan |
| `/output/{n}/mute` | `i` 0/1 | Mute |
| `/output/{n}/fx` | `f` dB (-65.0–0.0) | FX return level |
| `/output/{n}/stereo` | `i` 0/1 | Stereo pair |
| `/output/{n}/record` | `i` 0/1 | Record enable |
| `/output/{n}/playchan` | `i` | Play channel assign |
| `/output/{n}/phase` | `i` 0/1 | Phase invert |
| `/output/{n}/reflevel` | `→ i  ← is` | Reference level (`+4dBu`, `+13dBu`, `+19dBu`, `+24dBu`) |
| `/output/{n}/crossfeed` | `i` | Crossfeed |
| `/output/{n}/volumecal` | `f` dB | Volume calibration offset |
| `/output/{n}/loopback` | `i` 0/1 | Loopback |
| `/output/{n}/name` | `s` | Channel name |
| `/output/{n}/lowcut` | `i` 0/1 | Low cut enable `[lowcut]` |
| `/output/{n}/eq` | `i` 0/1 | EQ enable `[eq]` |
| `/output/{n}/dynamics` | `i` 0/1 | Dynamics enable `[dynamics]` |
| `/output/{n}/autolevel` | `i` 0/1 | AutoLevel enable `[autolevel]` |
| `/output/{n}/roomeq` | `i` 0/1 | Room EQ enable `[roomeq]` |

### Mixer

| Method | Arguments | Description |
| --- | --- | --- |
| `/mix/{out}/{type}/{in}` | `f` dB | Mix level for input `in` of type `input`/`playback` into output `out` |
| `/playback/{n}/mute` | `i` 0/1 | Playback channel mute |
| `/playback/{n}/stereo` | `i` 0/1 | Playback channel stereo pair |

### Reverb

| Method | Arguments | Description |
| --- | --- | --- |
| `/reverb` | `i` 0/1 | Reverb enable |
| `/reverb/type` | `→ i  ← is` | Reverb type (15 presets, e.g. `Small Room`, `Large Room`, `Space`, ...) |
| `/reverb/predelay` | `i` ms | Pre-delay |
| `/reverb/lowcut` | `i` Hz | Low cut frequency |
| `/reverb/roomscale` | `f` | Room scale |
| `/reverb/attack` | `i` ms | Attack |
| `/reverb/hold` | `i` ms | Hold |
| `/reverb/release` | `i` ms | Release |
| `/reverb/highcut` | `i` Hz | High cut |
| `/reverb/time` | `f` s | Reverb time |
| `/reverb/highdamp` | `i` | High damping |
| `/reverb/smooth` | `i` | Smooth |
| `/reverb/volume` | `f` dB | Return volume |
| `/reverb/width` | `f` | Stereo width |

### Echo

| Method | Arguments | Description |
| --- | --- | --- |
| `/echo` | `i` 0/1 | Echo enable |
| `/echo/type` | `→ i  ← is` | `Stereo Echo`, `Stereo Cross`, `Pong Echo` |
| `/echo/delay` | `f` 0.000–2.000 s | Delay time |
| `/echo/feedback` | `i` % | Feedback |
| `/echo/highcut` | `→ i  ← is` | High cut (`Off`, `16kHz`, `12kHz`, `8kHz`, `4kHz`, `2kHz`) |
| `/echo/volume` | `f` dB (-65.0–6.0) | Return volume |
| `/echo/width` | `f` | Stereo width |

### Control Room

| Method | Arguments | Description |
| --- | --- | --- |
| `/controlroom/mainout` | `→ i  ← is` | Main output assignment (channel pair, e.g. `1/2`) |
| `/controlroom/mainmono` | `i` 0/1 | Main mono |
| `/controlroom/muteenable` | `i` 0/1 | Mute enable |
| `/controlroom/dimreduction` | `f` dB (-65.0–0.0) | DIM reduction amount |
| `/controlroom/dim` | `i` 0/1 | DIM |
| `/controlroom/recallvolume` | `f` dB (-65.0–0.0) | Recall volume |

### Clock

| Method | Arguments | Description |
| --- | --- | --- |
| `/clock/source` | `→ i  ← is` | Clock source (`Internal`, `Word Clock`, `AES`, `Opt. 1`, `Opt. 2`, ...) |
| `/clock/samplerate` | `i` **R** | Current sample rate |
| `/clock/wckout` | `i` 0/1 | Word clock output enable |
| `/clock/wcksingle` | `i` 0/1 | Word clock single speed |
| `/clock/wckterm` | `i` 0/1 | Word clock termination |

### Hardware / Setup

| Method | Arguments | Description |
| --- | --- | --- |
| `/hardware/aesin` | `→ i  ← is` | AES input source (`XLR`, `Opt. 2`) |
| `/hardware/opticalin` | `→ i  ← is` | Optical input 1 (`ADAT`, `SPDIF`) |
| `/hardware/opticalin2` | `→ i  ← is` | Optical input 2 (`ADAT 2`, `SPDIF`) |
| `/hardware/opticalout` | `→ i  ← is` | Optical output 1 (`ADAT`, `SPDIF`) |
| `/hardware/opticalout2` | `→ i  ← is` | Optical output 2 (`ADAT 2`, `SPDIF`, `AES`) |
| `/hardware/spdifout` | `→ i  ← is` | S/PDIF output format (`Consumer`, `Professional`) |
| `/hardware/ccmode` | `i` **R** | Class-compliant mode active |
| `/hardware/ccmix` | `→ i  ← is` | CC mix mode (`TotalMix App`, `6ch + phones`, `8ch`, `20ch`) |
| `/hardware/ccrouting` | `→ i  ← is` | CC routing (`All Ch.`, `Phones`) |
| `/hardware/interfacemode` | `→ i  ← is` | Interface mode (`Auto`, `USB2`, `USB3`, `CC`) |
| `/hardware/standalonemidi` | `→ i  ← is` | Standalone MIDI (`Off`, `MIDI 1`, `MIDI 2`, `MADI Opt.`, `MADI Coax.`) |
| `/hardware/standalonearc` | `→ i  ← is` | Standalone ARC mode (`Volume`, `1s Op`, `Normal`) |
| `/hardware/lockkeys` | `→ i  ← is` | Key lock (`Off`, `Keys`, `All`) |
| `/hardware/remapkeys` | `i` 0/1 | Remap hardware keys |
| `/hardware/programkey0{1..4}` | `→ i  ← is` | Hardware key assignment (34 options) |
| `/hardware/lcdcontrast` | `i` | LCD contrast |
| `/hardware/madiinput` | `→ i  ← is` | MADI input (`Optical`, `Coaxial`, `Auto`, `Split`) |
| `/hardware/madioutput` | `→ i  ← is` | MADI output (`Optical`, `Mirror`, `Split`) |
| `/hardware/madiframe` | `→ i  ← is` | MADI frame rate (`96K Frame`, `48K Frame`) |
| `/hardware/madiformat` | `→ i  ← is` | MADI channel format (`56 (28) ch`, `64 (32 ch)`) |
| `/hardware/eqdrecord` | none | **W** Apply EQ to DURec signal |
| `/setup/store` | `→ i` | **W** Store current setup to slot (`Slot 1`–`Slot 6`) |
| `/setup/arcleds` | `→ i` | **W** Set ARC LED (`LED 1`–`LED 15`) |

### DURec

| Method | Arguments | Description |
| --- | --- | --- |
| `/durec/play` | none | **W** Start playback |
| `/durec/stop` | none | **W** Stop |
| `/durec/record` | none | **W** Start recording |
| `/durec/delete` | none | **W** Delete current file |
| `/durec/file` | `i` | Select file by index |
| `/durec/status` | `s` **R** | Status (`No Media`, `Stopped`, `Recording`, `Playing`, `Paused`, ...) |
| `/durec/position` | `i` **R** | Playback position (0–100%) |
| `/durec/time` | `i` **R** | Playback time (ms) |
| `/durec/usbload` | `i` **R** | USB load (%) |
| `/durec/usberrors` | `i` **R** | USB error count |
| `/durec/totalspace` | `f` **R** | Total storage (MB) |
| `/durec/freespace` | `f` **R** | Free storage (MB) |
| `/durec/numfiles` | `i` **R** | Number of files on storage |
| `/durec/next` | `i` **R** | Index of next file |
| `/durec/playmode` | `s` **R** | Play mode (`Single`, `UFX Single`, `Continuous`, `Single Next`, `Repeat Single`, `Repeat All`) |
| `/durec/recordtime` | `i` **R** | Remaining record time (s) |
| `/durec/name` | `is` **R** | File index + name |
| `/durec/samplerate` | `ii` **R** | File index + sample rate |
| `/durec/channels` | `ii` **R** | File index + channel count |
| `/durec/length` | `ii` **R** | File index + length (ms) |

### General

| Method | Arguments | Description |
| --- | --- | --- |
| `/device` | `ss` **R** | Device ID and name (sent on connect) |
| `/refresh` | none | **W** Re-send all current values |

### Sub-trees

#### `[lowcut]`
| Sub-path | Arguments | Description |
| --- | --- | --- |
| `/freq` | `i` 20–500 Hz | Low cut frequency |
| `/slope` | `i` enum | Filter slope |

#### `[eq]`
| Sub-path | Arguments | Description |
| --- | --- | --- |
| `/band1freq` | `i` 20–20000 Hz | Band 1 frequency |
| `/band1gain` | `f` -20.0–20.0 dB | Band 1 gain |
| `/band1q` | `f` 0.4–9.9 | Band 1 Q |
| `/band1type` | `→ i  ← is` | `Peak`, `Low Shelf`, `High Pass`, `Low Pass` |
| `/band2freq` | `i` 20–20000 Hz | Band 2 frequency |
| `/band2gain` | `f` -20.0–20.0 dB | Band 2 gain |
| `/band2q` | `f` 0.4–9.9 | Band 2 Q |
| `/band3freq` | `i` 20–20000 Hz | Band 3 frequency |
| `/band3gain` | `f` -20.0–20.0 dB | Band 3 gain |
| `/band3q` | `f` 0.4–9.9 | Band 3 Q |
| `/band3type` | `→ i  ← is` | `Peak`, `High Shelf`, `Low Pass`, `High Pass` |

#### `[dynamics]`
| Sub-path | Arguments | Description |
| --- | --- | --- |
| `/gain` | `f` -30.0–30.0 dB | Make-up gain |
| `/attack` | `i` 0–200 ms | Attack |
| `/release` | `i` 100–999 ms | Release |
| `/compthres` | `f` -60.0–0.0 dB | Compressor threshold |
| `/compratio` | `f` 1.0–10.0 | Compressor ratio |
| `/expthres` | `f` -99.0–20.0 dB | Expander threshold |
| `/expratio` | `f` 1.0–10.0 | Expander ratio |

#### `[autolevel]`
| Sub-path | Arguments | Description |
| --- | --- | --- |
| `/maxgain` | `f` 0.0–18.0 dB | Maximum gain |
| `/headroom` | `f` 3.0–12.0 dB | Headroom |
| `/risetime` | `f` 0.1–9.9 s | Rise time |

#### `[roomeq]`
| Sub-path | Arguments | Description |
| --- | --- | --- |
| `/delay` | `f` 0–425 ms | Delay |
| `/band1type` | `→ i  ← is` | `Peak`, `Low Shelf`, `High Pass`, `Low Pass` |
| `/band1freq` | `i` 20–20000 Hz | Band 1 frequency |
| `/band1gain` | `f` -20.0–20.0 dB | Band 1 gain |
| `/band1q` | `f` 0.4–9.9 | Band 1 Q |
| `/band{2..7}freq` | `i` 20–20000 Hz | Band 2–7 frequency |
| `/band{2..7}gain` | `f` -20.0–20.0 dB | Band 2–7 gain |
| `/band{2..7}q` | `f` 0.4–9.9 | Band 2–7 Q |
| `/band8type` | `→ i  ← is` | `Peak`, `High Shelf`, `Low Pass`, `High Pass` |
| `/band8freq` | `i` 20–20000 Hz | Band 8 frequency |
| `/band8gain` | `f` -20.0–20.0 dB | Band 8 gain |
| `/band8q` | `f` 0.4–9.9 | Band 8 Q |
| `/band9type` | `→ i  ← is` | `Peak`, `High Shelf`, `Low Pass`, `High Pass` |
| `/band9freq` | `i` 20–20000 Hz | Band 9 frequency |
| `/band9gain` | `f` -20.0–20.0 dB | Band 9 gain |
| `/band9q` | `f` 0.4–9.9 | Band 9 Q |

**R** = read-only (oscmix sends, client receives) · **W** = write-only · default = read/write

`→` = client → oscmix · `←` = oscmix → client · enum nodes: client sends `i` (integer index), oscmix sends back `is` (integer index + string name)

## Thanks

- [@juanramoncastan](https://github.com/juanramoncastan) - UFX II verifications, UI improvements, layout fixes and valuable suggestions ([#5](https://github.com/huddx01/oscmix/issues/5))
