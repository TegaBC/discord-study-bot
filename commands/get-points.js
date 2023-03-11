const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
    .setName("points")
    .setDescription("Shows points for selected user")
    .addUserOption(option => 
        option.setName("user")
        .setDescription("User's points which you wish to see")
        .setRequired(true)
    ),
	async execute(interaction) {
        await interaction.deferReply()

		const user = interaction.options.getUser("user")
        const points = interaction.client.db

        const userPoints = await points.findOne({ where: { userId: user.id } })

        if (userPoints) {
            await interaction.editReply(`**${user.username}** has **${userPoints.points}** ${userPoints.points == 1 ? "point" : "points"} ${interaction.user.toString()}`)
        } else {
            await interaction.editReply(`**${user.username}** has no points (has not commenced a study yet) ${interaction.user.toString()}`)
        }
	},
};