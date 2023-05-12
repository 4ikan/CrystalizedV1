const voice = require("@discordjs/voice");

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { demuxProbe, joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, NoSubscriberBehavior } = require("@discordjs/voice");
const fs = require("fs");
const play_dl = require("play-dl");

const audio_player_manager = require("../audio_player_manager");
const voice_connections = require("../voice_connections");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Play music with YouTube.")
        .addStringOption((option) =>
            option.setName("url").setDescription("YouTube URL.").setRequired(true)
        ),
	async execute(interaction) {
        await interaction.deferReply();
        let url = interaction.options.get("url").value;
        if(!url) return interaction.editReply(":x: YouTube URL is not provided, please provide a YouTube URL.");
        play_dl.stream(url)
        .then(stream => {
            const audio_player = createAudioPlayer({
                behaviors: {
                    noSubscriber: NoSubscriberBehavior.Play
                }
            });
            audio_player_manager.data.current.push({
                guild_id: interaction.member.guild.id,
                current: audio_player
            });
            const resource = createAudioResource(stream.stream, { inlineVolume: true, inputType: stream.type });
            resource.volume.setVolume(0.5);
            const connection = joinVoiceChannel({
                channelId: interaction.member.voice.channel.id,
                guildId: interaction.member.guild.id,
                adapterCreator: interaction.member.guild.voiceAdapterCreator,
            })
            voice_connections.data.current.push({
                guild_id: interaction.member.guild.id,
                current: connection
            });
            audio_player.on(AudioPlayerStatus.Playing, () => {
                console.log("The audio player has started playing.");
            });
            audio_player.on("error", error => {
                console.error(`Error: ${error}`);
                connection.destroy();
                const index = voice_connections.data.current.indexOf({
                    guild_id: interaction.member.guild.id,
                    current: connection
                });
                voice_connections.data.current.splice(index, 1);
                audio_player.stop();
                const index_2 = audio_player_manager.data.current.indexOf({
                    guild_id: interaction.member.guild.id,
                    current: audio_player
                });
                audio_player_manager.data.current.splice(index_2, 1);
            });
            audio_player.play(resource);
            connection.subscribe(audio_player);
            play_dl.video_info(url)
            .then(info => {
                return interaction.editReply(`:white_check_mark: Now playing ${info.video_details.title} **by** ${info.video_details.channel.name}`);
            })
            .catch(err => {
                return interaction.editReply(`
                :white_check_mark: Now playing
                :warning: **Unable to get information from YouTube video.**
                .`);
            });
            return interaction.editReply("**Fetching information...**");
        })
        .catch(console.log);
    },
};