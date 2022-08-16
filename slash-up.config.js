// This is the slash-up config file.
// Make sure to fill in "token" and "applicationId" before using.
// You can also use environment variables from the ".env" file if any.
const config = require('config')

module.exports = {
	// The Token of the Discord bot
	token: config.get('Token'),
	// The Application ID of the Discord bot
	applicationId: config.get('applicationId'),
	// This is where the path to command files are, .ts files are supported!
	commandPath: './src/SlashCommands/Commands',
	// You can use different environments with --env (-e)
	env: {
	  development: {
		// The "globalToGuild" option makes global commands sync to the specified guild instead.
			globalToGuild: config.get('guildId'),
	  },
	},
}
