// src/plugin/installer.js
import { getBaseValidators } from '../validators/core'
import { createI18nProxies } from '../validators/proxies'
import { createValidator } from '../utils/validator-wrapper'
import { registry } from './registry'
import { logger } from '../utils/logger'
import { createI18n } from 'vue-i18n'

export const installPlugin = (app, options = {}) => {
	logger.debug('Initializing Vue-Laradate plugin...')

	const { i18n, locale = 'en', fallbackLocale = 'en', messages = {} } = options

	const finalI18n = i18n || createI18n({
		legacy: false,
		locale,
		fallbackLocale,
		messages,
		missingWarn: false
	})

	app.use(finalI18n)

	const { withI18nMessage } = createI18nProxies(finalI18n.global)
	const baseValidators = getBaseValidators()

	console.log(baseValidators)

	const i18nValidators = {}

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

	const finalValidators = {}

	Object.keys(i18nValidators).forEach(name => {
		const validatorOrFactory = i18nValidators[name]
		if (typeof validatorOrFactory === 'function' && !validatorOrFactory.$validator) {
			finalValidators[name] = (...args) => createValidator(name, validatorOrFactory(...args))
		} else {
			finalValidators[name] = withI18nMessage(validatorOrFactory)
		}
	})

	registry.populate(finalValidators)

	app.provide('vuelidateValidators', finalValidators)
	app.config.globalProperties.$validators = finalValidators

	logger.debug('Plugin initialized successfully')
	return { i18n: finalI18n, validators: finalValidators }
}