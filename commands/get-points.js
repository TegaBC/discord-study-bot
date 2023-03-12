const { SlashCommandBuilder } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
    .setName("points")
    .setDescription("Shows points leaderboard or a selected users points")
    .addUserOption(option => 
        option.setName("user")
        .setDescription("User's points which you wish to see")
    ),
	async execute(interaction) {
        await interaction.deferReply()

		const user = interaction.options.getUser("user")
        const points = interaction.client.db

        if (user) {
            // show users points
            const userPoints = await points.findOne({ where: { userId: user.id } })

            if (userPoints) {
                await interaction.editReply(`**${user.username}** has **${userPoints.points}** ${userPoints.points == 1 ? "point" : "points"} ${interaction.user.toString()}`)
            } else {
                await interaction.editReply(`**${user.username}** has no points (has not commenced a study yet) ${interaction.user.toString()}`)
            }
        } else {
            // show top 10 people
            const allUsersPoints = await points.findAll({
                limit: 10,
                order: [["points", "DESC"]]
            })

            let leaderboardString = ""
        
            for (index in allUsersPoints) {
                let row = allUsersPoints[index]
                let person = await interaction.client.users.fetch(row.dataValues.userId)
                let personPoints = row.dataValues.points
                let leaderboardEntry = `**${person.tag}** : ${personPoints} points`
                
                leaderboardString += "\n" + leaderboardEntry
            }

           interaction.editReply(`__**Top 10 user's points:**__ 
           ${leaderboardString}`)
        }
	},
};