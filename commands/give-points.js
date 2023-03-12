const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js")
const { userHasRow, createUserRow, incrementPoints } = require("../db-funcs.js")

module.exports = {
	data: new SlashCommandBuilder()
    .setName("add-points")
    .setDescription("Adds points to person")
    .addUserOption(option => 
        option.setName("user")
        .setDescription("User to recieve points")
        .setRequired(true))
    .addNumberOption(option => 
        option.setName("points")
        .setDescription("Total points to give")
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	
    async execute(interaction) {
        await interaction.deferReply()

        const user = interaction.user
        const pointReciever = interaction.options.getUser("user")
        const pointsAmount = interaction.options.getNumber("points")
        const db = interaction.client.db

        if (await userHasRow(db, pointReciever.id) === null) await createUserRow(db, pointReciever.id)
        incrementPoints(db, pointReciever.id, pointsAmount)

        await interaction.editReply(`${user.toString()} gave **${pointReciever.username} ${pointsAmount}** points!`)
	},
};