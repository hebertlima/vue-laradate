import { getBaseValidators } from '../validators/core'
import { createI18nProxies } from '../validators/proxies'
import { createValidator } from '../utils/validator-wrapper'
import { registry } from './registry'
import { logger } from '../utils/logger'
import { createI18n } from 'vue-i18n'
import enMessages from '../i18n/en.json'

export const installPlugin = (app, options = {}) => {
	logger.debug('Initializing Vue-Laradate plugin...')

	const { i18n, locale = 'en', fallbackLocale = 'en', messages = {}, customValidations = [] } = options

	const finalMessages = {
		en: enMessages,
		...messages
	}

	const finalI18n = i18n || createI18n({
		legacy: false,
		locale,
		fallbackLocale,
		globalInjection: true,
		messages: finalMessages,
		missingWarn: false
	})

	app.use(finalI18n)

	const { withI18nMessage } = createI18nProxies(finalI18n.global)
	const baseValidators = getBaseValidators()
	const i18nValidators = {}
	const finalValidators = {}

	Object.keys(baseValidators).forEach(name => {
		const original = baseValidators[name]

		try {
			if (typeof original === 'function' && !original.$validator) {
				i18nValidators[name] = (...args) => {
					const instance = original(...args)
					return withI18nMessage(instance)
				}
			} else {
				i18nValidators[name] = withI18nMessage(original)
			}
		} catch (error) {
			logger.warn(`Could not wrap validator "${name}" with i18n message`, error)
			i18nValidators[name] = original
		}
	})

	Object.keys(i18nValidators).forEach(name => {
		const validatorOrFactory = i18nValidators[name]
		if (typeof validatorOrFactory === 'function' && !validatorOrFactory.$validator) {
			finalValidators[name] = (...args) => createValidator(name, validatorOrFactory(...args))
		} else {
			finalValidators[name] = withI18nMessage(validatorOrFactory)
		}
	})

	Object.entries(customValidations).forEach(([name, validator]) => finalValidators[name] = validator)

	registry.populate(finalValidators)

	app.provide('vueLaradateValidators', finalValidators)
	app.provide('vueLaradateI18n', finalI18n.global)
	app.config.globalProperties.$validators = finalValidators

	logger.debug('Plugin initialized successfully')
	return { i18n: finalI18n, validators: finalValidators }
}