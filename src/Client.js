const Discord = require('discord.js')
const config = require('config')

class TagBotClient extends Discord.Client {
	constructor () {
		super({
			retryLimit: 5,
			intents: [ 'DirectMessages', 'DirectMessageReactions', 'GuildWebhooks', 'GuildInvites', 'GuildMessages', 'GuildMessageReactions', 'Guilds', 'MessageContent' ],
			partials: [ 'CHANNEL', 'REACTION' ],
		})

		Discord.Message.prototype.sendError = function (error) {
			if (error !== undefined) { //In case a promise is rejected without an error
				return this.channel.send(`Whoops. An error occured. Please report this on the issue tracker.\n\`\`\`js\n${error.stack}\n\`\`\``)
			}
		}

		Discord.Message.prototype.hasPerm = function (permission) {
			let perms = false

			if(this.channel.type !== "text"){
				perms = true
			}else{
				if(this.channel.permissionsFor(this.client.user).has(permission)){
					perms = true
				}
			}

			return perms
		}
	}

	/**
	 * Logs the client in
	 * @function
	 * @returns {Promise}
	 * @author Mackan
	 */
	login() {
		return super.login(config.get('Token'))
	}

	/**
	 * The commands for the bot
	 * @type {Object}
	 */
	set commands(commands){
		this._commands = commands
	}

	get commands(){
		return this._commands
	}

	/**
	 * The prefix for commands
     * @type {string}
     */
	get Prefix(){
		return config.get('prefix')
	}

	/**
	 * @type {Object}
	 */
	set redis(redis){
		this._redis = redis
	}

	get redis(){
		return this._redis
	}

	/**
	 * The cache class for the bot
     * @type {Cache}
     */
	set cache(cache){
		this._cache = cache
	}

	get cache(){
		return this._cache
	}
}

module.exports = TagBotClient