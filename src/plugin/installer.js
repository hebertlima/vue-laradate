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

	const i18nValidators = Object.keys(baseValidators).reduce((acc, name) => {
		acc[name] = withI18nMessage(baseValidators[name])
		return acc
	}, {})

	const finalValidators = {}
	for (const name in i18nValidators) {
		finalValidators[name] = createValidator(name, i18nValidators[name])
	}

	registry.populate(finalValidators)

	app.provide('vuelidateValidators', finalValidators)
	app.config.globalProperties.$validators = finalValidators

	logger.debug('Plugin initialized successfully')
	return { i18n: finalI18n, validators: finalValidators }
}