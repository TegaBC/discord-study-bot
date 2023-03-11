const { Events } = require('discord.js');
const Sequelize = require('sequelize')

const db = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
})

const sequelize = db.define('database', {
	userId: {
		type: Sequelize.STRING,
		unique: true},
	study_time: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,},
	points: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,}
})

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		sequelize.sync()
		client.db = sequelize
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};