const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ 
	intents: [ 
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	] 
});

client.commands = new Collection();
client.chatCommands = []
client.sessionStorage = []

// reads slash commands

const commandsPath = path.join(__dirname, 'commands'); // get path for commands
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js')); // get seperate command files

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file); // get the path of the command file
	const command = require(filePath); 
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ("data" in command && "execute" in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// reads chat commands

const chatCommandsPath = path.join(__dirname, 'chat-commands'); // get path for commands
const chatCommandFiles = fs.readdirSync(chatCommandsPath).filter(file => file.endsWith('.js')); // get seperate command files

for (const file of chatCommandFiles) {
	const filePath = path.join(chatCommandsPath, file); // get the path of the command file
	const command = require(filePath); 
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ("execute" in command) {
		client.chatCommands[command.name] = command;
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a execute function.`);
	}
}

// reads events

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Log in to Discord with your client's token
client.login(token);

