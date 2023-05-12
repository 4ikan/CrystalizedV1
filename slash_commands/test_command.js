require("dotenv").config();

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("test")
		.setDescription("Testing command."),
	async execute(interaction) {
    await interaction.deferReply();
    const button = new ButtonBuilder()
    .setLabel("Click me")
    .setStyle(ButtonStyle.Primary)
    .setCustomId("my_button");
    return interaction.editReply({
      content: "Here is a button!",
      components: [new ActionRowBuilder().addComponents(button)],
    });
  },
};