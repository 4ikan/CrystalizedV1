// I have python also lol. ~ RemotionalBlox

require("dotenv").config();

const antiCrash = require("./anti_crash");

// Start Anti-Crash
antiCrash();

const { Client, Partials } = require("discord.js");
const client = new Client({
    intents: 131071,
    partials: [Partials.Channel, Partials.GuildMember, Partials.GuildScheduledEvent, Partials.Message, Partials.Reaction, Partials.ThreadMember, Partials.User]
});
const fs = require("fs");

require("./uptime");

const eventsFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));

for (const file of eventsFiles) {
	const event = require(`./events/${file}`);
    event.execute(client);
}

client.login(process.env.TOKEN);