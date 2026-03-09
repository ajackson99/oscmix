
// device_ffucxii.js

// Shared reflevel option sets
const RL_IN     = ['+13dBu', '+19dBu'];
const RL_OUT    = ['+4dBu', '+13dBu', '+19dBu'];
const RL_PHONES = ['Low', 'High'];

// Helper for plain digital channels with no gain or reflevel
const dig = (name) => ({ name, flags: [], gain: null, reflevel: null });

export const device_ffucxii = {
	deviceName: 'Fireface UCX II',
	midiPortNames: ['Port 2'],

	inputs: [
		// Mic/Line 1-2: gain 0-75 dB, 48V + autoset, no reflevel
		{ name: 'Mic/Line 1',  flags: ['gain', '48v', 'autoset'],              gain: { min: 0, max: 75 }, reflevel: null   },
		{ name: 'Mic/Line 2',  flags: ['gain', '48v', 'autoset'],              gain: { min: 0, max: 75 }, reflevel: null   },
		// Inst/Line 3-4: gain 0-24 dB, reflevel, hi-z + autoset
		{ name: 'Inst/Line 3', flags: ['gain', 'reflevel', 'hi-z', 'autoset'], gain: { min: 0, max: 24 }, reflevel: RL_IN  },
		{ name: 'Inst/Line 4', flags: ['gain', 'reflevel', 'hi-z', 'autoset'], gain: { min: 0, max: 24 }, reflevel: RL_IN  },
		// Analog 5-8: reflevel only (INPUT_HAS_GAIN set in C but .gain={0,0}, treated as no gain knob)
		{ name: 'Analog 5',    flags: ['reflevel'],                             gain: null,                reflevel: RL_IN  },
		{ name: 'Analog 6',    flags: ['reflevel'],                             gain: null,                reflevel: RL_IN  },
		{ name: 'Analog 7',    flags: ['reflevel'],                             gain: null,                reflevel: RL_IN  },
		{ name: 'Analog 8',    flags: ['reflevel'],                             gain: null,                reflevel: RL_IN  },
		// Digital
		dig('SPDIF L'), dig('SPDIF R'),
		dig('ADAT 1'),  dig('ADAT 2'),  dig('ADAT 3'),  dig('ADAT 4'),
		dig('ADAT 5'),  dig('ADAT 6'),  dig('ADAT 7'),  dig('ADAT 8'),
	],

	outputs: [
		// Analog 1-6: standard reflevel
		{ name: 'Analog 1',  flags: ['reflevel'], gain: null, reflevel: RL_OUT    },
		{ name: 'Analog 2',  flags: ['reflevel'], gain: null, reflevel: RL_OUT    },
		{ name: 'Analog 3',  flags: ['reflevel'], gain: null, reflevel: RL_OUT    },
		{ name: 'Analog 4',  flags: ['reflevel'], gain: null, reflevel: RL_OUT    },
		{ name: 'Analog 5',  flags: ['reflevel'], gain: null, reflevel: RL_OUT    },
		{ name: 'Analog 6',  flags: ['reflevel'], gain: null, reflevel: RL_OUT    },
		// Phones 7-8: Low/High
		{ name: 'Phones 7',  flags: ['reflevel'], gain: null, reflevel: RL_PHONES },
		{ name: 'Phones 8',  flags: ['reflevel'], gain: null, reflevel: RL_PHONES },
		// Digital
		dig('SPDIF L'), dig('SPDIF R'),
		dig('ADAT 1'),  dig('ADAT 2'),  dig('ADAT 3'),  dig('ADAT 4'),
		dig('ADAT 5'),  dig('ADAT 6'),  dig('ADAT 7'),  dig('ADAT 8'),
	],

	get inputNames()  { return this.inputs.map(ch => ch.name);  },
	get outputNames() { return this.outputs.map(ch => ch.name); },

	getFlags(type, index) {
		if (type === 'input')    return [...(this.inputs[index]?.flags  ?? []), 'input'];
		if (type === 'output')   return [...(this.outputs[index]?.flags ?? []), 'output'];
		if (type === 'playback') return ['playback'];
		return [];
	},

	hardware_standalonemidi: {
		names: ['Off', 'MIDI 1', 'MIDI 2'],
		type: 'enum',
	},
};
