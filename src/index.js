import { installPlugin } from './plugin/installer'
import { registry } from './plugin/registry'

export default {
	install: installPlugin,
	isReady: registry.isReady,
	getValidator: registry.get
}