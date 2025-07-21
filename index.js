import i18nSetup from './src/i18n-setup'
import * as validators from './validators'

export default {
	install(app, options = {}) {
		const { i18n, validators: i18nValidators } = i18nSetup.install(app, options)

		app.provide('vuelidateValidators', i18nValidators)
		app.config.globalProperties.$validators = i18nValidators
	},
	...validators
}

export * from './validators'