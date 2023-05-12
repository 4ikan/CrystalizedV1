require("dotenv").config();

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("unban")
		.setDescription("Unban user from the server.")
        .addUserOption((option) =>
            option.setName("user").setDescription("Choose user to unban.").setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	async execute(interaction) {
        await interaction.deferReply();
        let user = interaction.options.get("user").value;
        if(!user) return interaction.editReply(":x: User is not provided, please provide a user.");
        interaction.member.guild.bans.fetch({user: user, force: true})
        .then(ban => {
            let username = ban.user.username;
            const embed = new EmbedBuilder();
            embed.setTitle("User UNBANNED");
            embed.setColor([0, 255, 0]);
            embed.setDescription(`
            ${username} has been unbanned from the server.
            `);
            interaction.member.guild.members.unban(ban.user.id)
            .then(() => {
                return interaction.editReply({
                    embeds: [embed]
                });
            })
            .catch(console.log);
        })
        .catch(console.log);
	},
};