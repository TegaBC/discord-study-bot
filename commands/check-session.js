const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder().setName("check-session").setDescription("Checks time left on current session"),
	async execute(interaction) {
        const userStorage = interaction.client.sessionStorage[interaction.user.id]

        if (userStorage) {
            let timeLeft = (userStorage.finishTime -  Date.now()) / 60_000
            await interaction.reply(`${interaction.user.toString()} has **${Math.round(timeLeft)}m** left of their current **${userStorage.study ? "study" : "break"}** session.`)
        } 
        else 
        {
            await interaction.reply(`${interaction.user.toString()} is currently not in a session.`)
        }
	},
};