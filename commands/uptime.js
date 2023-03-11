const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder().setName("uptime").setDescription("Checks uptime"),
	async execute(interaction) {
		await interaction.reply(`${interaction.user.toString()}, current uptime: ${interaction.client.uptime / 3_600_000} hours.`);
	},
};