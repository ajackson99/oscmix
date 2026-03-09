
// device_ffufxii.js

// Shared reflevel option sets
const RL_IN      = ['+4dBu', 'Lo Gain'];
const RL_OUT     = ['-10dBV', '+4dBu', 'Hi Gain'];
const RL_OUT_XLR = ['-10dBV', '+4dBu', 'Hi Gain', '+24dBu'];
const RL_PHONES  = ['Low', 'High'];

// Helper to build a plain digital channel entry
const dig = (name) => ({ name, flags: [], gain: null, reflevel: null });

export const device_ffufxii = {
	deviceName: 'Fireface UFX II',
	midiPortNames: ['Port 3'],

	inputs: [
		// Analog 1-8: gain 0-12 dB, reflevel
		{ name: 'Analog 1',    flags: ['gain', 'reflevel'],                     gain: { min: 0, max: 12 }, reflevel: RL_IN  },
		{ name: 'Analog 2',    flags: ['gain', 'reflevel'],                     gain: { min: 0, max: 12 }, reflevel: RL_IN  },
		{ name: 'Analog 3',    flags: ['gain', 'reflevel'],                     gain: { min: 0, max: 12 }, reflevel: RL_IN  },
		{ name: 'Analog 4',    flags: ['gain', 'reflevel'],                     gain: { min: 0, max: 12 }, reflevel: RL_IN  },
		{ name: 'Analog 5',    flags: ['gain', 'reflevel'],                     gain: { min: 0, max: 12 }, reflevel: RL_IN  },
		{ name: 'Analog 6',    flags: ['gain', 'reflevel'],                     gain: { min: 0, max: 12 }, reflevel: RL_IN  },
		{ name: 'Analog 7',    flags: ['gain', 'reflevel'],                     gain: { min: 0, max: 12 }, reflevel: RL_IN  },
		{ name: 'Analog 8',    flags: ['gain', 'reflevel'],                     gain: { min: 0, max: 12 }, reflevel: RL_IN  },
		// Mic/Inst 9-12: gain 0-75 dB, 48V + hi-z + autoset
		{ name: 'Mic/Inst 9',  flags: ['gain', '48v', 'hi-z', 'autoset'],      gain: { min: 0, max: 75 }, reflevel: null   },
		{ name: 'Mic/Inst 10', flags: ['gain', '48v', 'hi-z', 'autoset'],      gain: { min: 0, max: 75 }, reflevel: null   },
		{ name: 'Mic/Inst 11', flags: ['gain', '48v', 'hi-z', 'autoset'],      gain: { min: 0, max: 75 }, reflevel: null   },
		{ name: 'Mic/Inst 12', flags: ['gain', '48v', 'hi-z', 'autoset'],      gain: { min: 0, max: 75 }, reflevel: null   },
		// Digital
		dig('AES L'),  dig('AES R'),
		dig('ADAT 1'), dig('ADAT 2'), dig('ADAT 3'), dig('ADAT 4'),
		dig('ADAT 5'), dig('ADAT 6'), dig('ADAT 7'), dig('ADAT 8'),
	],

	outputs: [
		// Analog 1-2: XLR reflevel (4 options)
		{ name: 'Analog 1',  flags: ['reflevel'], reflevel: RL_OUT_XLR },
		{ name: 'Analog 2',  flags: ['reflevel'], reflevel: RL_OUT_XLR },
		// Analog 3-8: standard reflevel
		{ name: 'Analog 3',  flags: ['reflevel'], reflevel: RL_OUT     },
		{ name: 'Analog 4',  flags: ['reflevel'], reflevel: RL_OUT     },
		{ name: 'Analog 5',  flags: ['reflevel'], reflevel: RL_OUT     },
		{ name: 'Analog 6',  flags: ['reflevel'], reflevel: RL_OUT     },
		{ name: 'Analog 7',  flags: ['reflevel'], reflevel: RL_OUT     },
		{ name: 'Analog 8',  flags: ['reflevel'], reflevel: RL_OUT     },
		// Phones 9-12: Low/High
		{ name: 'Phones 9',  flags: ['reflevel'], reflevel: RL_PHONES  },
		{ name: 'Phones 10', flags: ['reflevel'], reflevel: RL_PHONES  },
		{ name: 'Phones 11', flags: ['reflevel'], reflevel: RL_PHONES  },
		{ name: 'Phones 12', flags: ['reflevel'], reflevel: RL_PHONES  },
		// Digital
		dig('AES L'),  dig('AES R'),
		dig('ADAT 1'), dig('ADAT 2'), dig('ADAT 3'), dig('ADAT 4'),
		dig('ADAT 5'), dig('ADAT 6'), dig('ADAT 7'), dig('ADAT 8'),
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
		type: 'enum'
	},
};
