import { createI18nMessage } from '@vuelidate/validators'
import { logger } from '../utils/logger'

export const createI18nProxies = (i18n) => {
	const withI18nMessage = createI18nMessage({
		t(key, params) {
			try {

				if (params?.property) {
					const attributeKey = `attributes.${params.property}`
					const attribute = i18n.t(attributeKey)
					if (attribute !== attributeKey) {
						params.property = attribute
					}
				}

				return i18n.t(key, params)
			} catch (error) {
				logger.warn(`Translation error for key "${key}":`, error)
				return key
			}
		}
	})

	return { withI18nMessage }
}