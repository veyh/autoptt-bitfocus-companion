import { generateEslintConfig } from '@companion-module/tools/eslint/config.mjs'

const cfg = generateEslintConfig({
	enableTypescript: true,
})

cfg.rules.prettier = "off"; // no thanks

export default cfg;
