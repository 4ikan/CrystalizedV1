const voice = require("@discordjs/voice");

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { demuxProbe, joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require("@discordjs/voice");
const fs = require("fs");
const ytdl = require("ytdl-core");

const audio_player_manager = require("../audio_player_manager");
const voice_connections = require("../voice_connections");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("leave")
		.setDescription("Leaves bot from the voice channel."),
	async execute(interaction) {
        await interaction.deferReply();
        const voice_connection = voice_connections.data.current.find(c => c.guild_id === interaction.member.guild.id);
        if(voice_connection) {
            voice_connection.current.destroy();
            const index = voice_connections.data.current.indexOf(voice_connection);
            voice_connections.data.current.splice(index, 1);
        }
        const audio_player = audio_player_manager.data.current.find(c => c.guild_id === interaction.member.guild.id);
        if(audio_player) {
            audio_player.current.stop();
            const index = audio_player_manager.data.current.indexOf(audio_player);
            audio_player_manager.data.current.splice(index, 1);
        }
        return interaction.editReply(":octagonal_sign: Left the voice channel.");
    },
};