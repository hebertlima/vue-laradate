import { helpers } from '@vuelidate/validators'
import { getCurrentInstance } from 'vue'

export function defineValidator({
	name,
	validator,
	params = {},
	async = false
}) {
	const finalMessage = (ctx) => {
		const instance = getCurrentInstance()
		const t = instance?.appContext?.config.globalProperties?.$t ?? ((key) => key)
		const path = `validations.${name}`
		return t(path, { ...ctx.$params, $model: ctx.$model })
	}

	const wrapped = (value, siblings, vm) =>
		!helpers.req(value) || validator.call(vm, value, siblings, vm)

	const isAsync = async || validator.constructor.name === 'AsyncFunction'

	const validated = isAsync
		? helpers.withAsync(wrapped)
		: wrapped

	const withParams = helpers.withParams({ type: name, ...params }, validated)

	return helpers.withMessage(finalMessage, withParams)
}
