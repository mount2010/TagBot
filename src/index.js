const config = require("config")
const redis = require("redis")
const { SlashCreator, GatewayServer } = require('slash-create')
const path = require('path')

const TagBotClient = require("./Client.js")

const commandHandler = require(`./Commands/Handler.js`)
const messageHandler = require(`./Handlers/messageCreate.js`)

const Cache = require(`./Util/Cache`)

const Client = new TagBotClient()
const commands = new commandHandler(`${__dirname}/Commands/Commands`)

const creator = new SlashCreator({
	applicationID: config.get('applicationId'),
	publicKey: config.get('publicKey'),
	token: config.get('Token'),
	client: Client,
})

creator
	.withServer(
		new GatewayServer(
			(handler) => Client.ws.on('INTERACTION_CREATE', handler),
		),
	)
	.registerCommandsIn(path.join(__dirname, 'Commands'))

const redisCli = redis.createClient({
	host: config.get('redis.host'),
	port: config.get('redis.port'),
})

redisCli.on("error", err => {
	throw err
})

const cache = new Cache(redisCli)

const r = require("rethinkdbdash")({
	pool: false,
})

async function init () {
	let connection
	try {
		connection = await r.connect({
			host: config.get('db.url'),
			port: config.get('db.port'),
			password: config.get('db.pass'),
			user: config.get('db.user'),
			db: config.get('db.db'),
		})
		console.log("\u001b[92mConnected to rethink\u001b[39m")
	} catch (e) {
		console.error('Failed to connect to rethink: ', e)
		throw e
	}

	const ReDB = {
		r: r,
		conn: connection,
	}

	global.ReDB = ReDB

	await commands.loadCommands()

	Client.commands = commands
	Client.cache = cache


	Client.login()

	Client.on('ready', () => {
		console.log(`\u001b[92mLogged in as ${Client.user.username}\u001b[39m`)
	})

	Client.on("messageCreate", (message) => {
		messageHandler(message)
	})
}

init()
