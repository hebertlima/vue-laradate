// validator-proxy.js
import { inject } from 'vue';
import { helpers } from '@vuelidate/validators';

export function createValidator(name) {
	const validatorImplementation = function (value, ...params) {
		const injectedValidators = inject('vuelidateValidators');

		if (!injectedValidators) {
			console.error(`[vue-laradate] Validators not found at runtime for '${name}'. Please check if the plugin is installed correctly and if it's being used within the setup() context.`);
			return false;
		}

		const targetValidator = injectedValidators[name];

		if (!targetValidator) {
			console.error(`[vue-laradate] Validator "${name}" not found in injectedValidators. Check i18n-setup.js.`);
			return false;
		}

		const validationFunction = targetValidator.$validator;

		if (typeof validationFunction !== 'function') {
			console.error(`[vue-laradate] targetValidator.$validator for "${name}" is not a function.`, targetValidator);
			return false;
		}

		const validationResult = validationFunction(value, ...params);

		return validationResult;
	};

	const messageImplementation = (ctx) => {
		const injectedValidators = inject('vuelidateValidators');

		if (!injectedValidators || !injectedValidators[name]) {
			console.warn(`[vue-laradate] Injected validators or validator "${name}" not available for message lookup.`);
			return `Validation message not found for  ${name}`;
		}

		const targetValidator = injectedValidators[name];

		const messageFunction = targetValidator.$message;

		if (typeof messageFunction === 'function') {
			const msg = messageFunction(ctx);
			return msg;
		} else {
			console.warn(`[vue-laradate] The $message property for validator "${name}" is not a function.`, targetValidator);
			return `Validation failed for ${name} (missing message property)`;
		}
	};

	return helpers.withMessage(
		messageImplementation,
		helpers.withParams(
			{ type: name },
			validatorImplementation
		)
	);
}