import { CompanionActionDefinitions } from '@companion-module/base/dist/index.js';
import type { ModuleInstance } from './main.js'
import { ActivationMode } from './autoptt.js';

export function UpdateActions(self: ModuleInstance): void {
	const actions: CompanionActionDefinitions = {
		toggleMuteGlobal: {
			name: "Toggle Mute (Global)",
			options: [],
			callback: async (_event) => {
				self.ipc.toggleMuteGlobal();
			},
		},

		pushToMuteGlobal: {
			name: "Push-to-Mute (Global)",
			options: [{
				id: "value",
				type: "checkbox",
				label: "Active",
				default: true,
			}],
			callback: async (event) => {
				const value = event.options.value as boolean;
				self.ipc.setPushToMuteGlobalDown(value);
			},
		},

		toggleMute: {
			name: "Toggle Mute",
			options: [{
				id: "keyGroup",
				type: "number",
				label: "Key Group",
				default: 1, min: 1, max: 100,
			}],
			callback: async (event) => {
				const keyGroup = event.options.keyGroup as number;
				self.ipc.toggleMute((keyGroup ?? 1) - 1);
			},
		},

		pushToMute: {
			name: "Push-to-Mute",
			options: [{
				id: "keyGroup",
				type: "number",
				label: "Key Group",
				default: 1, min: 1, max: 100,
			}, {
				id: "value",
				type: "checkbox",
				label: "Active",
				default: true,
			}],
			callback: async (event) => {
				const keyGroup = event.options.keyGroup as number;
				const value = event.options.value as boolean;
				self.ipc.setPushToMuteDown((keyGroup ?? 1) - 1, value);
			},
		},

		pushToTalk: {
			name: "Push-to-Talk",
			options: [{
				id: "keyGroup",
				type: "number",
				label: "Key Group",
				default: 1, min: 1, max: 100,
			}, {
				id: "value",
				type: "checkbox",
				label: "Active",
				default: true,
			}],
			callback: async (event) => {
				const keyGroup = event.options.keyGroup as number;
				const value = event.options.value as boolean;
				self.ipc.setPushToTalkDown((keyGroup ?? 1) - 1, value);
			},
		},

		setActivationMode: {
			name: "Set Activation Mode",
			options: [{
				id: "value",
				type: "dropdown",
				label: "Value",
				default: ActivationMode.AUTOMATIC,
				choices: getActivationModeChoices(),
			}],
			callback: async (event) => {
				const value = event.options.value as number;
				self.ipc.setActivationMode(value);
			},
		}
	};

	addProfileActions(self, actions);

	self.setActionDefinitions(actions);
}

function addProfileActions(
	self: ModuleInstance,
	actions: CompanionActionDefinitions
) {
	if (!self.ipc.supportsProfiles()) {
		return;
	}

	actions.changeProfile = {
		name: "Change Profile",
		options: [{
			id: "profileId",
			type: "dropdown",
			label: "Profile Name",
			choices: getProfileChoices(self),
			default: getProfileChoicesDefault(self),
		}],
		callback: async (event) => {
			self.ipc.changeProfile(event.options.profileId as string);
		},
	};

	actions.setAutoProfileSwitch = {
		name: "Set Automatic Profile Switching",
		options: [{
			id: "value",
			type: "checkbox",
			label: "Value",
			default: true,
		}],
		callback: async (event) => {
			self.ipc.setAutoProfileSwitch(event.options.value as boolean);
		},
	};

	actions.toggleAutoProfileSwitch = {
		name: "Toggle Automatic Profile Switching",
		options: [],
		callback: async (_event) => {
			self.ipc.toggleAutoProfileSwitch();
		},
	};
}

function getActivationModeChoices() {
	const values = [];

	for (const [key, value] of Object.entries(ActivationMode)) {
		if (typeof value !== "number" || value < 0) {
			continue;
		}

		values.push({ id: value, label: key });
	}

	return values;
}

function getProfileChoices(self: ModuleInstance) {
	return self.ipc
		.getProfileIdsAndNames()
		.map(({ id, name }) => ({ id, label: name }));
}

function getProfileChoicesDefault(self: ModuleInstance) {
	return self.ipc.getProfileIdsAndNames().at(-1)?.id ?? "";
}
