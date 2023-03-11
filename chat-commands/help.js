
const helpMessage = `**Prefix:** >
**/pomodoro [study-time] [break-time] [(optional) rounds]:** starts a pomodoro based on the given inputs.
**/check-session:** if you are in a pomodoro session it simply tells you how long is left of the current session.
**/uptime*:** tells you how long I have been online for.`

module.exports = {
    name: "help",
    execute(message) {
        const channel = message.channel
        channel.send(`${message.author.toString()} Help command will be added soon soon.`)
        message.react("✅")
    }
}