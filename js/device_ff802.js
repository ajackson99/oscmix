
// device_ff802.js

// Shared reflevel option sets
const RL_IN  = ['+4dBu', 'Lo Gain'];
const RL_OUT = ['-10dBV', '+4dBu', 'Hi Gain'];

// Helper for plain digital channels with no gain or reflevel
const dig = (name) => ({ name, flags: [], gain: null, reflevel: null });

export const device_ff802 = {
	deviceName: 'Fireface 802',
	midiPortNames: ['Port 2'],

	inputs: [
		// Analog 1-8: gain 0-12 dB, reflevel
		{ name: 'Analog 1',    flags: ['gain', 'reflevel'], gain: { min: 0, max: 12 }, reflevel: RL_IN },
		{ name: 'Analog 2',    flags: ['gain', 'reflevel'], gain: { min: 0, max: 12 }, reflevel: RL_IN },
		{ name: 'Analog 3',    flags: ['gain', 'reflevel'], gain: { min: 0, max: 12 }, reflevel: RL_IN },
		{ name: 'Analog 4',    flags: ['gain', 'reflevel'], gain: { min: 0, max: 12 }, reflevel: RL_IN },
		{ name: 'Analog 5',    flags: ['gain', 'reflevel'], gain: { min: 0, max: 12 }, reflevel: RL_IN },
		{ name: 'Analog 6',    flags: ['gain', 'reflevel'], gain: { min: 0, max: 12 }, reflevel: RL_IN },
		{ name: 'Analog 7',    flags: ['gain', 'reflevel'], gain: { min: 0, max: 12 }, reflevel: RL_IN },
		{ name: 'Analog 8',    flags: ['gain', 'reflevel'], gain: { min: 0, max: 12 }, reflevel: RL_IN },
		// Mic/Inst 9-12: 48V + hi-z only, no gain, no reflevel
		{ name: 'Mic/Inst 9',  flags: ['48v', 'hi-z'],     gain: null, reflevel: null },
		{ name: 'Mic/Inst 10', flags: ['48v', 'hi-z'],     gain: null, reflevel: null },
		{ name: 'Mic/Inst 11', flags: ['48v', 'hi-z'],     gain: null, reflevel: null },
		{ name: 'Mic/Inst 12', flags: ['48v', 'hi-z'],     gain: null, reflevel: null },
		// Digital
		dig('AES L'),   dig('AES R'),
		dig('ADAT 1'),  dig('ADAT 2'),  dig('ADAT 3'),  dig('ADAT 4'),
		dig('ADAT 5'),  dig('ADAT 6'),  dig('ADAT 7'),  dig('ADAT 8'),
		dig('ADAT 9'),  dig('ADAT 10'), dig('ADAT 11'), dig('ADAT 12'),
		dig('ADAT 13'), dig('ADAT 14'), dig('ADAT 15'), dig('ADAT 16'),
	],

	outputs: [
		// Analog 1-8: reflevel
		{ name: 'Analog 1',  flags: ['reflevel'], gain: null, reflevel: RL_OUT },
		{ name: 'Analog 2',  flags: ['reflevel'], gain: null, reflevel: RL_OUT },
		{ name: 'Analog 3',  flags: ['reflevel'], gain: null, reflevel: RL_OUT },
		{ name: 'Analog 4',  flags: ['reflevel'], gain: null, reflevel: RL_OUT },
		{ name: 'Analog 5',  flags: ['reflevel'], gain: null, reflevel: RL_OUT },
		{ name: 'Analog 6',  flags: ['reflevel'], gain: null, reflevel: RL_OUT },
		{ name: 'Analog 7',  flags: ['reflevel'], gain: null, reflevel: RL_OUT },
		{ name: 'Analog 8',  flags: ['reflevel'], gain: null, reflevel: RL_OUT },
		// Phones + digital
		dig('Phones 9'),  dig('Phones 10'), dig('Phones 11'), dig('Phones 12'),
		dig('AES L'),     dig('AES R'),
		dig('ADAT 1'),    dig('ADAT 2'),  dig('ADAT 3'),  dig('ADAT 4'),
		dig('ADAT 5'),    dig('ADAT 6'),  dig('ADAT 7'),  dig('ADAT 8'),
		dig('ADAT 9'),    dig('ADAT 10'), dig('ADAT 11'), dig('ADAT 12'),
		dig('ADAT 13'),   dig('ADAT 14'), dig('ADAT 15'), dig('ADAT 16'),
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
		names: ['Off', 'On'],
		type: 'bool',
	},
};
