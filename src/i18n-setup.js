import * as baseValidators from '@vuelidate/validators'
import { createI18n } from 'vue-i18n'
import { createI18nMessage } from '@vuelidate/validators'
import enMessages from '../lang/en.json'

export default {
	install(app, options = {}) {
		const { locale = 'en', fallbackLocale = 'en', messages = {} } = options

		const i18n = createI18n({
			legacy: false,
			locale,
			fallbackLocale,
			messages: {
				en: enMessages,
				...messages
			},
			missingWarn: false,
		})

		const withI18nMessage = createI18nMessage({
			t(key, params) {
				if (params && params.property) {
					const label = i18n.global.t(`attributes.${params.property}`)
					params.property = label !== `attributes.${params.property}` ? label : params.property
				}
				return i18n.global.t(key, params)
			},
		})

		const i18nValidators = {
			required: withI18nMessage(baseValidators.required),
			email: withI18nMessage(baseValidators.email),
			alpha: withI18nMessage(baseValidators.alpha),
			alphaNum: withI18nMessage(baseValidators.alphaNum),
			numeric: withI18nMessage(baseValidators.numeric),
			integer: withI18nMessage(baseValidators.integer),
			decimal: withI18nMessage(baseValidators.decimal),
			url: withI18nMessage(baseValidators.url),
			sameAs: withI18nMessage(baseValidators.sameAs),
			not: withI18nMessage(baseValidators.not),
			and: withI18nMessage(baseValidators.and),
			or: withI18nMessage(baseValidators.or),
			minLength: withI18nMessage(baseValidators.minLength),
			maxLength: withI18nMessage(baseValidators.maxLength),
			minValue: withI18nMessage(baseValidators.minValue),
			maxValue: withI18nMessage(baseValidators.maxValue),
			between: withI18nMessage(baseValidators.between),
			ipAddress: withI18nMessage(baseValidators.ipAddress),
			macAddress: withI18nMessage(baseValidators.macAddress),
			requiredIf: withI18nMessage(baseValidators.requiredIf),
			requiredUnless: withI18nMessage(baseValidators.requiredUnless)
		}

		return { i18n, validators: i18nValidators }
	}
}