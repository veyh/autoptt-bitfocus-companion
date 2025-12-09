import { CompanionFeedbackDefinitions, SomeCompanionFeedbackInputField } from '@companion-module/base/dist/index.js';
import type { ModuleInstance } from './main.js'
import { extendedActivityState } from './variables.js'

export function UpdateFeedbacks(self: ModuleInstance): void {
	const keyGroupOption: SomeCompanionFeedbackInputField = {
		id: "keyGroup",
		label: "Key Group",
		type: "number",
		default: 1,
		min: 1,
		max: 100,
	}

	const feedbacks: CompanionFeedbackDefinitions = {
		colorByActivityGlobalMute: {
			type: "boolean",
			name: "Color by Activity: Global Mute",
			options: [{ ...keyGroupOption }],
			defaultStyle: {
				color: 16777215,
				bgcolor: 16711680,
			},
			callback(feedback, _context) {
				return "INACTIVE_GLOBAL_MUTE" === extendedActivityState(self, (feedback.options.keyGroup as number) - 1);
			}
		},

		colorByActivityToggleMute: {
			type: "boolean",
			name: "Color by Activity: Toggle Mute",
			options: [{ ...keyGroupOption }],
			defaultStyle: {
				color: 16777215,
				bgcolor: 13369548
			},
			callback(feedback, _context) {
				return "INACTIVE_TOGGLE_MUTE" === extendedActivityState(self, (feedback.options.keyGroup as number) - 1);
			}
		},

		colorByActivityInactive: {
			type: "boolean",
			name: "Color by Activity: Inactive",
			options: [{ ...keyGroupOption }],
			defaultStyle: {
				color: 16777215,
				bgcolor: 5131597
			},
			callback(feedback, _context) {
				return "INACTIVE" === extendedActivityState(self, (feedback.options.keyGroup as number) - 1);
			}
		},

		colorByActivityActive: {
			type: "boolean",
			name: "Color by Activity: Active",
			options: [{ ...keyGroupOption }],
			defaultStyle: {
				color: 0,
				bgcolor: 65280
			},
			callback(feedback, _context) {
				return "ACTIVE" === extendedActivityState(self, (feedback.options.keyGroup as number) - 1);
			}
		},

		colorByActivityReleaseDelay: {
			type: "boolean",
			name: "Color by Activity: Release Delay",
			options: [{ ...keyGroupOption }],
			defaultStyle: {
				color: 0,
				bgcolor: 16776960
			},
			callback(feedback, _context) {
				return "ACTIVE_RELEASE_DELAY" === extendedActivityState(self, (feedback.options.keyGroup as number) - 1);
			}
		},

		colorByActivityTapActivationWindow: {
			type: "boolean",
			name: "Color by Activity: Tap Activation Window",
			options: [{ ...keyGroupOption }],
			defaultStyle: {
				color: 0,
				bgcolor: 16776960
			},
			callback(feedback, _context) {
				return "ACTIVE_TAP_ACTIVATION_WINDOW" === extendedActivityState(self, (feedback.options.keyGroup as number) - 1);
			}
		},
	};

	self.feedbackIds = Object.keys(feedbacks);
	self.setFeedbackDefinitions(feedbacks);
}
