const logLevels = ['error', 'warn', 'info', 'debug']
const currentLevel = process.env.NODE_ENV === 'production' ? 'warn' : 'debug'

export const logger = {
	shouldLog(level) {
		return logLevels.indexOf(level) <= logLevels.indexOf(currentLevel)
	},

	log(level, ...args) {
		if (this.shouldLog(level)) {
			console[level](`[Vue-Laradate]`, ...args)
		}
	},

	debug(...args) { this.log('debug', ...args) },
	info(...args) { this.log('info', ...args) },
	warn(...args) { this.log('warn', ...args) },
	error(...args) { this.log('error', ...args) }
}