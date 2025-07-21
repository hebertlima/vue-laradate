# Vue Laradate Validators (🚧 Under Development 🚧)

A Vue 3 plugin to seamlessly integrate Vuelidate with `vue-i18n` for translated validation messages, inspired by Laravel's validation error messages.

## ✨ Features

  * **Translated Validation Messages:** Out-of-the-box support for `vue-i18n` to provide user-friendly, translated validation messages.
  * **Laravel-inspired Attributes:** Automatically translates attribute names (e.g., "email" to "E-mail") within validation messages, mimicking Laravel's validation message style.
  * **Easy Integration:** Provides a simple way to import and use Vuelidate validators that are already configured for internationalization.
  * **Minimal Setup:** Once installed, validators can be used just like standard Vuelidate validators in your components.

-----

## 🚀 Installation

1.  **Install Dependencies:**

    ```bash
    npm install vue-laradate @vuelidate/core @vuelidate/validators vue-i18n@next
    # OR
    yarn add vue-laradate @vuelidate/core @vuelidate/validators vue-i18n@next
    ```

2.  **Plugin Configuration (`main.js` or `main.ts`):**

    ```javascript
    // main.js
    import { createApp } from 'vue'
    import App from './App.vue'
    import VueLaradate from '@hebertlima/vue-laradate'
	import pt from '@lang/pt.json' // alias point to laravel lang folder

    const app = createApp(App)

    app.use(VueLaradate, {
        locale: 'pt', 			// default locale
        fallbackLocale: 'en', 	// fallback locale
        messages: {
			en: {}, // you can replace this with your own messages
            pt: pt, // translate file,
			es: {
				validations: {},
				attributes: {},
			}, 
			// you can add more languages here
        }
    })

    app.mount('#app')
    ```

3.  **Language Files (`lang/en.json` - example):**

    Create your language files (e.g., `src/lang/en.json`):

    ```json
    // en.json
    {
		// all default vuelidate message translations
        "validations": {
            "required": "The field {property} is required.",
			"alpha": "The {property} is not alphabetical",
			"alphaNum": "The {property} must be alpha-numeric",
			"and": "The {property} does not match all of the provided validators",
			"between": "The {property} must be between {min} and {max}",
			"decimal": "{property} must be decimal",
			"email": "{property} is not a valid email address",
			"integer": "{property} is not an integer",
			"ipAddress": "The {property} is not a valid IP address",
			"macAddress": "The {property} is not a valid MAC Address",
			"maxLength": "The maximum length allowed is {max}",
			"maxValue": "The maximum {property} allowed is {max}",
			"minLength": "This field should be at least {min} characters long",
			"minValue": "The minimum {property} allowed is {min}",
			"not": "The {property} does not match the provided validator",
			"numeric": "{property} must be numeric",
			"or": "The {property} does not match any of the provided validators",
			"requiredIf": "The {property} is required",
			"requiredUnless": "The {property} is required",
			"sameAs": "The {property} must be equal to the {otherName} value",
			"url": "The {property} is not a valid URL address"
        },
        "attributes": {
			"email": "E-mail",
			"password": "Password",
			"username": "Username",
			// Better names for placeholders
		}
    }
    ```

4.  **Using Validators in Your Component:**

    ```ts
    <script setup>
    import { ref, computed } from 'vue'
    import { useVuelidate } from '@vuelidate/core'
    // Import your custom validators from your plugin's export
    - import { required, email } from '@vuelidate/validators'
	+ import { required, email } from '@hebertlima/vue-laradate/validators'
	

    const formData = ref({
        email: '',
        password: ''
    })

    const rules = computed(() => ({
		email: {
			required,
			email
		},
		password: {
			required,
			minLength: minLength(6) // Validators with parameters work too!
		}
	}))

    const v$ = useVuelidate(rules, formData)

    const submitForm = async () => {
        const result = await v$.value.$validate()
        if (result) {
            alert('Form is valid!')
        } else {
            alert('Form has errors!')
        }
    }
    </script>

    <template>
        <form @submit.prevent="submitForm">
            <div>
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="formData.email" @blur="v$.email.$touch" />
                <div v-if="v$.email.$error">{{ v$.email.$errors[0].$message }}</div>
            </div>
            <div>
                <label for="password">Password:</label>
                <input type="password" id="password" v-model="formData.password" @blur="v$.password.$touch" />
                <div v-if="v$.password.$error">{{ v$.password.$errors[0].$message }}</div>
            </div>
            <button type="submit">Submit</button>
        </form>
    </template>
    ```

-----

## ⚠️ Development Status

This project is currently **under active development**. It has been created to solve a specific problem and is being refined. While the core functionality for internationalized Vuelidate messages is working, further testing, documentation, and feature enhancements are planned.

Your feedback and contributions are welcome as we continue to improve this plugin\!

-----

## ✅ Todo
- Tests soon!