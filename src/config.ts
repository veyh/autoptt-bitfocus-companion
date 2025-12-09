import { type SomeCompanionConfigField } from '@companion-module/base'

export interface ModuleConfig {
	ipcAddr: string
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'textinput',
			id: 'ipcAddr',
			label: 'IPC Address',
			width: 8,
			default: 'tcp://127.1.2.3:4000',
		},
	]
}
