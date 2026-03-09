
// device_ffucx.js

// Shared reflevel option sets
const RL_IN  = ['-10dBV', '+4dBu', 'Lo Gain'];
const RL_OUT = ['-10dBV', '+4dBu', 'Hi Gain'];

// Helper for plain digital channels with no gain or reflevel
const dig = (name) => ({ name, flags: [], gain: null, reflevel: null });

export const device_ffucx = {
	deviceName: 'Fireface UCX',
	midiPortNames: ['Port 1'],

	inputs: [
		// Mic 1-2: gain 0-65 dB, 48V + autoset, no reflevel
		{ name: 'Mic 1', flags: ['gain', '48v', 'autoset'],              gain: { min: 0, max: 65 }, reflevel: null  },
		{ name: 'Mic 2', flags: ['gain', '48v', 'autoset'],              gain: { min: 0, max: 65 }, reflevel: null  },
		// AN 3-4: gain 0-12 dB, reflevel, hi-z + autoset
		{ name: 'AN 3',  flags: ['gain', 'reflevel', 'hi-z', 'autoset'], gain: { min: 0, max: 12 }, reflevel: RL_IN },
		{ name: 'AN 4',  flags: ['gain', 'reflevel', 'hi-z', 'autoset'], gain: { min: 0, max: 12 }, reflevel: RL_IN },
		// AN 5-8: reflevel only, no gain
		{ name: 'AN 5',  flags: ['reflevel'],                             gain: null,                reflevel: RL_IN },
		{ name: 'AN 6',  flags: ['reflevel'],                             gain: null,                reflevel: RL_IN },
		{ name: 'AN 7',  flags: ['reflevel'],                             gain: null,                reflevel: RL_IN },
		{ name: 'AN 8',  flags: ['reflevel'],                             gain: null,                reflevel: RL_IN },
		// Digital
		dig('SPDIF L'), dig('SPDIF R'),
		dig('ADAT 1'),  dig('ADAT 2'),  dig('ADAT 3'),  dig('ADAT 4'),
		dig('ADAT 5'),  dig('ADAT 6'),  dig('ADAT 7'),  dig('ADAT 8'),
	],

	outputs: [
		// AN 1-6 + PH 7-8: reflevel
		{ name: 'AN 1',    flags: ['reflevel'], gain: null, reflevel: RL_OUT },
		{ name: 'AN 2',    flags: ['reflevel'], gain: null, reflevel: RL_OUT },
		{ name: 'AN 3',    flags: ['reflevel'], gain: null, reflevel: RL_OUT },
		{ name: 'AN 4',    flags: ['reflevel'], gain: null, reflevel: RL_OUT },
		{ name: 'AN 5',    flags: ['reflevel'], gain: null, reflevel: RL_OUT },
		{ name: 'AN 6',    flags: ['reflevel'], gain: null, reflevel: RL_OUT },
		{ name: 'PH 7',    flags: ['reflevel'], gain: null, reflevel: RL_OUT },
		{ name: 'PH 8',    flags: ['reflevel'], gain: null, reflevel: RL_OUT },
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
		names: ['Off', 'MIDI 1', 'MIDI 2', 'MADI O', 'MADI C'],
		type: 'enum',
	},
};
