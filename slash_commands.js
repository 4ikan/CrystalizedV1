require("dotenv").config();

const { REST, Routes } = require("discord.js");
const fs = require("fs");

// Register Slash Commands

module.exports = {
	refresh: () => {
		const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
		// Our guild's commands.
		const commandFiles = fs.readdirSync("./slash_commands").filter(file => file.endsWith(".js"));
		const commands = [];
		for(const file of commandFiles) {
			const command = require(`./slash_commands/${file}`);
			commands.push(command.data.toJSON());
		}
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		rest.put(
			Routes.applicationCommands(process.env.CLIENT_ID),
			{ body: commands },
		).then(data => {
			console.log(`Successfully reloaded ${data.length} application (/) commands.`);
		}).catch(err => {
			console.error(err);
		});
	}
}