const { SlashCommandBuilder } = require("discord.js");
const wait = require('node:timers/promises').setTimeout;

const replies = {
    study: {
        sessionStart: "Study is commencing",
        sessionMiddle: "Midpoint of study has been reached.",
    },
    break: {
        sessionStart: "Break is starting, take a breather",
        sessionMiddle: "Midpoint of break time has been reaeched.",
    }
}

function oneDecimal(num) {
    return Math.round(num * 10) / 10
}

const beginSession = async (interaction, length, study) => {
    // save session in storage
    interaction.client.sessionStorage[interaction.user.id] = {startTime: Date.now(), length: length, finishTime: Date.now() + length, study: study} // timestamp 

    const channel = interaction.channel
    const user = interaction.user

    let replyOptions = study ? replies.study : replies.break

    channel.send(`**SESSION** | ${replyOptions.sessionStart} | **${oneDecimal(length / 60_000)} minute session.** | ${user.toString()}`)
    await wait(length / 2)
    channel.send(`**SESSION** | ${replyOptions.sessionMiddle} | **${oneDecimal((length / 2) / 60_000)} minutes left.** | ${user.toString()}`)
    await wait(length / 2)
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
    .addNumberOption(option =>
        option.setName("rounds")
        .setDescription("How many rounds (study, break and then study) should be set?")
    ),

    async execute(interaction) {
        const rounds = interaction.options.getNumber("rounds") ?? 1
        const studyLength = interaction.options.getNumber("study-length") * 60_000
        const breakLength = interaction.options.getNumber("break-length") * 60_000
        const channel = interaction.channel

        await interaction.reply("**SESSION** | Initializing pomodoro session with" + interaction.user.toString());

        for (let i = 1; i <= rounds; i++) {
            await beginSession(interaction, studyLength, true)
            await beginSession(interaction, breakLength, false)
            await beginSession(interaction, studyLength, true)
            
            if (rounds > 1) channel.send(`**SESSION** | ${i}/${rounds} rounds completed | ${user.toString()}`)
        }

        channel.send(`**SESSION** | Study session completed! | ${user.toString()}`)
	},
};