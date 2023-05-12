require("dotenv").config();

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ban")
		.setDescription("Ban user from the server.")
        .addUserOption((option) =>
            option.setName("user").setDescription("Choose user to ban.").setRequired(true)
        )
        .addStringOption((option) =>
            option.setName("reason").setDescription("What reason.").setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	async execute(interaction) {
        await interaction.deferReply();
        let user = interaction.options.get("user").value;
        let reason = interaction.options.get("reason").value;
        if(!user) return interaction.editReply(":x: User is not provided, please provide a user.");
        if(!reason) return interaction.editReply(":x: Reason is not provided, please provide a reason.");
        interaction.member.guild.members.fetch({user: `${user}`, force: true})
        .then(member => {
            let username = member.user.username;
            const embed = new EmbedBuilder();
                embed.setTitle("User BANNED");
                embed.setColor([255, 0, 0]);
                embed.setDescription(`
                ${username} has been banned from the server.
                Reason: ${reason}
                `);
            const dm_embed = new EmbedBuilder();
            dm_embed.setTitle("Uh oh...");
            dm_embed.setColor([255, 0, 0]);
            dm_embed.setDescription(`
            You have been banned from the server due to multiple violations.
            Reason: ${reason}
            `);
            member.send({
                embeds: [dm_embed]
            })
            .then(() => {
                member.ban({ reason: reason })
                .then(() => {
                    return interaction.editReply({
                        embeds: [embed]
                    });
                })
                .catch(console.log);
            })
            .catch(err => {
                interaction.channel.send(":x: I don't have permission to DM the member. Member doesn't have DM permissions.");
            });
        })
        .catch(console.log);
	},
};