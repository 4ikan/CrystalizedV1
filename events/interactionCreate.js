require("dotenv").config();

const fs = require("fs");

module.exports = {
    execute: (client) => {
        client.on("interactionCreate", async(interaction) => {
            if(!interaction.isChatInputCommand()) return;
            const commandFiles = fs.readdirSync("./slash_commands").filter(file => file.endsWith(".js"));
            const commands = [];
            for(const file of commandFiles) {
                if(fs.readFileSync(`./slash_commands/${file}`)) {
                    const command = require(`../slash_commands/${file}`);
                    commands.push(command);
                }
            }
            const command = commands.find(command => command.data.toJSON().name == interaction.commandName);
            if(command) {
                try {
                    command.execute(interaction);
                } catch(err) {
                    console.log(err);
                }
            }
        });
    }
}