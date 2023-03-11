const { SlashCommandBuilder } = require("discord.js");
const { userHasRow, createUserRow, incrementPoints, incrementTime } = require("../db-funcs.js")
const wait = require("node:timers/promises").setTimeout;

const POINTS_PER_MIN = 3

const replies = {
    study: {
        sessionStart: "📚 | Study is commencing",
    },
    break: {
        sessionStart: "⚽ | Break is starting, take a breather",
    }
}

async function trackTime(table, userId, time) {

    if (await userHasRow(table, userId) === null) { // check if user has row
        createUserRow(table, userId) // create a user row
        incrementTime(table, userId, time)
    }else {
        incrementTime(table, userId, time) // adds time
    }
}

async function addPoints(table, userId, points) {

    if (await userHasRow(table, userId) === null) { // check if user has row
        createUserRow(table, userId) // create a user row
        incrementPoints(table, userId, points)
    }else {
        incrementPoints(table, userId, points) // adds points
    }
}

const beginSession = async (interaction, length, study) => {
    // save session in storage
    let finishTime = Date.now() + length
    interaction.client.sessionStorage[interaction.user.id] = { startTime: Date.now(), 
        length: length, 
        finishTime: finishTime, 
        study: study
    }

    const channel = interaction.channel
    const user = interaction.user
    let replyOptions = study ? replies.study : replies.break

    // send message, wait and then edit it to be com pleted
    const originalMessage = await channel.send(`${replyOptions.sessionStart} | ⏰ Finishes <t:${Math.round(finishTime/1000)}:R> | ${user.toString()}`)
    await wait(length)
    originalMessage.edit(`${replyOptions.sessionStart} | ✅ | ${user.toString()}`)
   
    // give points if it was a study session
    if (study) {

    }

    // remove current session from the object
    delete interaction.client.sessionStorage[interaction.user.id]
}

module.exports = {
	data: new SlashCommandBuilder()
    .setName("pomodoro")
    .setDescription("Start a pomodoro study timer")
    .addNumberOption(option =>
        option.setName("study-length")
        .setDescription("How long (in minutes), should the work session last?")
        .setRequired(true)
    )
    .addNumberOption(option =>
        option.setName("break-length")
        .setDescription("How long (in minutes), should the break last?")
        .setRequired(true)
    )
    .addIntegerOption(option =>
        option.setName("rounds")
        .setDescription("How many rounds (study, break and then study) should be set?")
    ),

    async execute(interaction) {
        const rounds = Math.round(interaction.options.getNumber("rounds") ?? 1)
        const studyLength = interaction.options.getNumber("study-length") 
        const breakLength = interaction.options.getNumber("break-length")
        const channel = interaction.channel

        await interaction.reply(`🏎️ | Starting pomodoro ${interaction.user.toString()} | **(Study: ${studyLength}m, Break: ${breakLength}m)**`);

        for (let i = 1; i <= rounds; i++) {
            await beginSession(interaction, studyLength * 60_000, true)
            await beginSession(interaction, breakLength * 60_000, false)
            await beginSession(interaction, studyLength * 60_000, true)
            
            // give points to user for study
            const pointsEarned = Math.max(Math.round(length * POINTS_PER_MIN), 1)  
            addPoints(interaction.client.db, user.id, pointsEarned)
            channel.send(`💰 | ${user.toString()} | Earned **${pointsEarned} points** for **${length}m** of study!`)

            //  track time
            trackTime(interaction.client.db, interaction.user.id, studyLength * 2)

            if (rounds > 1) channel.send(`📚 | ${i}/${rounds} rounds completed | ${user.toString()}`)
        }

        channel.send(`✅ | Session fully completed! | ${interaction.user.toString()}`)
	},
};