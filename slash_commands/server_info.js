require("dotenv").config();

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

function timeDifference(current, previous) {
    let msPerMinute = 60 * 1000;
    let msPerHour = msPerMinute * 60;
    let msPerDay = msPerHour * 24;
    let msPerMonth = msPerDay * 30;
    let msPerYear = msPerDay * 365;
    let elapsed = current - previous;
    if(elapsed < msPerMinute) {
         return `${Math.round(elapsed/1000)} seconds ago`;   
    }
    else if(elapsed < msPerHour) {
         return `${Math.round(elapsed/msPerMinute)} minutes ago`;   
    }
    else if(elapsed < msPerDay) {
         return `${Math.round(elapsed/msPerHour)} hours ago`;   
    }
    else if(elapsed < msPerMonth) {
        return `${Math.round(elapsed/msPerDay)} days ago`;   
    }
    else if(elapsed < msPerYear) {
        return `${Math.round(elapsed/msPerMonth)} months ago`;   
    }
    else {
        return `${Math.round(elapsed/msPerYear)} years ago`;   
    }
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName("server_info")
		.setDescription("Fetches Info about this Discord Server"),
	async execute(interaction) {
        await interaction.deferReply();
        let date = new Date(interaction.member.guild.createdAt);
        let hours = "";
        let minutes = "";
        let seconds = "";
        if(date.getHours() < 9) {
            hours = "0"+date.getHours();
        } else {
            hours = date.getHours();
        }
        if(date.getMinutes() < 9) {
            minutes = "0"+date.getMinutes();
        } else {
            minutes = date.getMinutes();
        }
        if(date.getSeconds() < 9) {
            seconds = "0"+date.getSeconds();
        } else {
            seconds = date.getSeconds();
        }
        const embed = new EmbedBuilder();
        embed.setTitle("Server Info");
        embed.setDescription(
            `
            **__Created Date:__**
            ${(date.getDate())}/${(date.getMonth()+1)}/${date.getFullYear()} ${hours}:${minutes}:${seconds} (${timeDifference(Date.now(), interaction.member.guild.createdAt)})
            `
        );
        return interaction.editReply({
            embeds: [embed]
        });
	},
};