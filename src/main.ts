import { InstanceBase, runEntrypoint, InstanceStatus, SomeCompanionConfigField, combineRgb } from '@companion-module/base'
import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpdateVariableDefinitions } from './variables.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import IPC from "./IPC.js";
import { Ipc as AutopttIpc } from "./autoptt.js";

export class ModuleInstance extends InstanceBase<ModuleConfig> {
	config!: ModuleConfig;
	ipc = new IPC;
	feedbackIds: string[] = [];

	constructor(internal: unknown) {
		super(internal);
	}

	async init(config: ModuleConfig): Promise<void> {
		this.config = config;

		this.updateStatus(InstanceStatus.Ok);

		this.updateActions();
		this.updateFeedbacks();
		this.updateVariableDefinitions();
		this.updatePresets();

		this.ipc.logDebug = (...args: any[]) => {
			this.log("debug", this.formatLog(args));
		};

		this.ipc.logError = (...args: any[]) => {
			this.log("error", this.formatLog(args));
		};

		this.ipc.connectRetryIntervalSec = 5;
		this.ipc.ipcTag = "autoptt-bitfocus-companion";
		this.ipc.setAddr(this.config.ipcAddr);
		this.ipc.start();

		this.ipc.onMessageHook = this.onMessageHook;
	}

	formatLog(args: any[]) {
		const parts = [];

		for (const arg of args) {
			if (typeof arg === "object") {
				parts.push(JSON.stringify(arg));
			}

			else {
				parts.push(arg);
			}
		}

		return parts.join(", ");
	}

	onMessageHook = (_msg: AutopttIpc) => {
		this.updateVariableDefinitions();
		this.checkFeedbacks(...this.feedbackIds);

		// Because the docs say that updating actions is costly, I guess we'll
		// just avoid doing that unless there have been changes to the profiles,
		// since those are the things that affect actions.

		if (this.ipc.supportsProfiles()) {
			const json = JSON.stringify(this.ipc.getProfileIdsAndNames());

			if (this.profilesJson !== json) {
				this.updateActions();
			}

			this.profilesJson = json;
		}
	};

	private profilesJson = "";

	async destroy(): Promise<void> {
		this.log('debug', 'destroy');
		this.ipc.stop();
	}

	async configUpdated(config: ModuleConfig): Promise<void> {
		this.config = config;
		this.ipc.setAddr(this.config.ipcAddr);
	}

	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields();
	}

	updateActions(): void {
		UpdateActions(this);
	}

	updateFeedbacks(): void {
		UpdateFeedbacks(this);
	}

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this);
	}

	updatePresets(): void {
		this.setPresetDefinitions({
			ActivityColorAndActivationModeText: {
				type: "button",
				category: "Default",
				name: "Activity Color and Activation Mode Text",
				style: {
					text: "$(autoptt:activationModeShort)",
					size: 'auto',
					color: combineRgb(255, 255, 255),
					bgcolor: combineRgb(0, 0, 0),
				},
				steps: [],
				feedbacks: [
					{
						feedbackId: "colorByActivityGlobalMute",
						options: { keyGroup: 1 },
						style: {
							color: 16777215,
							bgcolor: 16711680,
						},
					},
					{
						feedbackId: "colorByActivityToggleMute",
						options: { keyGroup: 1 },
						style: {
							color: 16777215,
							bgcolor: 13369548
						},
					},
					{
						feedbackId: "colorByActivityInactive",
						options: { keyGroup: 1 },
						style: {
							color: 16777215,
							bgcolor: 5131597
						},
					},
					{
						feedbackId: "colorByActivityActive",
						options: { keyGroup: 1 },
						style: {
							color: 0,
							bgcolor: 65280
						},
					},
					{
						feedbackId: "colorByActivityReleaseDelay",
						options: { keyGroup: 1 },
						style: {
							color: 0,
							bgcolor: 16776960
						},
					},
					{
						feedbackId: "colorByActivityTapActivationWindow",
						options: { keyGroup: 1 },
						style: {
							color: 0,
							bgcolor: 16776960
						},
					}
				],
			}
		});
	}
}

runEntrypoint(ModuleInstance, UpgradeScripts);
