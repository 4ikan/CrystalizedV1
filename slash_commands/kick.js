require("dotenv").config();

const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("kick")
		.setDescription("Kick user from the server.")
        .addUserOption((option) =>
            option.setName("user").setDescription("Choose user to kick.").setRequired(true)
        )
        .addStringOption((option) =>
            option.setName("reason").setDescription("What reason.").setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
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
                embed.setTitle("User Kicked");
                embed.setColor([255, 0, 0]);
                embed.setDescription(`
                ${username} has been kicked from the server.
                Reason: ${reason}
                `);
            const dm_embed = new EmbedBuilder();
            dm_embed.setTitle("Uh oh...");
            dm_embed.setColor([255, 0, 0]);
            dm_embed.setDescription(`
            You have been kicked from the server.
            Reason: ${reason}
            `);
            member.send({
                embeds: [dm_embed]
            })
            .then(() => {
                member.kick(reason)
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