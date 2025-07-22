import { logger } from '../utils/logger'

const validators = {}
let isReady = false
const pendingRequests = {}

export const registry = {
	get(name) {
		if (!isReady) {
			logger.error(`Registry accessed before initialization (requested ${name}). Ensure the plugin is installed before using 'inject'.`)
			return () => false
		}

		return validators[name]
	},

	populate(validatorsMap) {
		Object.assign(validators, validatorsMap)
		isReady = true

		logger.debug('Registry populated with', Object.keys(validatorsMap).length, 'validators')
	},

	isReady() {
		return isReady
	},

	getAll() {
		return { ...validators }
	}
}