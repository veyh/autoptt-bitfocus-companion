import type { ModuleInstance } from './main.js'
import {
	activationModeToJSON,
	activityStateToJSON,
	appEnabledStateToJSON,
	ActivationMode,
} from "./autoptt.js";

export function UpdateVariableDefinitions(self: ModuleInstance): void {
	const defs = [
		{ variableId: 'activationMode', name: 'Activation Mode' },
		{ variableId: 'activationModeShort', name: 'Activation Mode (Short)' },
		{ variableId: 'aggregateActivityState', name: 'Activity State' },
		{ variableId: 'isMuted', name: 'Global Mute State' },
		{ variableId: 'toggleMuteGlobalIsActive', name: 'Toggle Global Mute State' },
		// { variableId: 'currentValue', name: 'Current Value' },
		{ variableId: 'appEnabledState', name: 'App Enabled State' },
	];

	const values: any = {
		activationMode: activationModeToJSON(self.ipc.activationMode),
		activationModeShort: activationModeShort(self.ipc.activationMode),
		aggregateActivityState: activityStateToJSON(self.ipc.aggregateActivityState),
		isMuted: self.ipc.isMuted,
		toggleMuteGlobalIsActive: self.ipc.toggleMuteGlobalIsActive,
		// currentValue: self.ipc.currentValue,
		appEnabledState: appEnabledStateToJSON(self.ipc.appEnabledState),
	};

	for (const [index, active] of self.ipc.toggleMuteStates.entries()) {
		const name = `Toggle Mute ${index + 1}`;
		const variableId = `toggleMute_${index + 1}`;
		defs.push({ name, variableId });
		values[variableId] = !!active;
	}

	for (let index = 0; index < self.ipc.activityStates.length; index++) {
		const name = `Activity State ${index + 1} (Extended)`;
		const variableId = `activityState_${index + 1}`;
		defs.push({ name, variableId });
		values[variableId] = extendedActivityState(self, index);
	}

	defs.push({ variableId: "profileName", name: "Profile Name" });
	values.profileName = self.ipc.profileName;

	defs.push({ variableId: "profileId", name: "Profile ID" });
	values.profileId = self.ipc.profileId;

	defs.push({ variableId: "autoProfileSwitch", name: "Automatic Profile Switching" });
	values.autoProfileSwitch = self.ipc.autoProfileSwitch;

	self.setVariableDefinitions(defs);
	self.setVariableValues(values);
}

function activationModeShort(mode: ActivationMode): string {
	switch (mode) {
		case ActivationMode.AUTOMATIC: return "VA";
		case ActivationMode.TAP_PTT: return "TAP";
		case ActivationMode.MANUAL: return "PTT";
		case ActivationMode.TAP_OPEN_MIC_TO_PTT: return "OM2Tap";
		case ActivationMode.MANUAL_OPEN_MIC_TO_PTT: return "OM2PTT";
	}

	return "???";
}

export function extendedActivityState(self: ModuleInstance, index: number): string {
	if (self.ipc.toggleMuteGlobalIsActive
	||  self.ipc.isMuted) {
		return "INACTIVE_GLOBAL_MUTE";
	}

	else if (self.ipc.toggleMuteStates[index]) {
		return "INACTIVE_TOGGLE_MUTE";
	}

	return activityStateToJSON(self.ipc.activityStates[index]);
}
