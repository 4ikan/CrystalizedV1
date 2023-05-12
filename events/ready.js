require("dotenv").config();

const { ActivityType } = require("discord.js");
const ping = require("ping");
const {default: axios} = require("axios");

const slashCommandsHandler = require("../slash_commands");

let lockdown = false;

let current_ip = "";
let average_ping = 0;

let activities = [
    {
        name: lockdown === true ? `Server in lockdown` : `/help`,
        type: lockdown === true ? ActivityType.Watching : ActivityType.Watching
    },
    {
        name: `My ping is: ${average_ping} ms`,
        type: ActivityType.Watching
    }
];
let activitiesIndex = 0;

const updateActivities = (client) => {
    try {
        if(current_ip !== "") {
            ping.promise.probe(current_ip)
            .then(ping_data => {
                average_ping = ping_data.time;
                activities[1].name = `My ping is: ${average_ping} ms`;
                let chosenActivity = activities[activitiesIndex];
                client.user.setPresence({ activities: [chosenActivity], status: lockdown === true ? "idle" : "online" });
            })
            .catch(console.log);
        } else {
            let chosenActivity = activities[activitiesIndex];
            client.user.setPresence({ activities: [chosenActivity], status: lockdown === true ? "idle" : "online" });
        }
        activitiesIndex++;
        if(activitiesIndex > (activities.length - 1)) {
            activitiesIndex = 0;
        }
    } catch(err) {
        updateActivities(client);
    }
}

module.exports = {
    execute: (client) => {
        client.on("ready", () => {
            try {
                console.log(`${client.user.tag} has connected to Discord.`);
                // Ping
                axios({
                    url: "http://ip-api.com/json",
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .then(res => {
                    current_ip = res.data.query;
                })
                .catch(console.log);
                // Register Slash Commands.
                client.application.commands.set([]);
                setTimeout(() => {
                    slashCommandsHandler.refresh(); 
                }, 1000);
                // Set Activity on Discord Bot.
                updateActivities(client);
                setInterval(() => {
                    updateActivities(client);
                }, 10000);
            } catch(err) {
            }
        });
    }
}