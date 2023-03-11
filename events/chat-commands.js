const { Events } = require("discord.js")
const { prefix } = require("../config.json")

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author === message.client) return;
        if (message.content[0] != prefix) return;

        // get command name
        let commandMessage = message.content.slice(1).split(" ")
        const commandName = commandMessage[0]

        // get command from folder
        const chatCommands = message.client.chatCommands
        const command = chatCommands[commandName]

        if (command) {
            commandMessage.shift() // get rid of command name
            command.execute(message, ...commandMessage)
        }
    }
}