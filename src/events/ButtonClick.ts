import PonjoUtil from "../utils/PonjoUtil";
import config from "../resources/Config";

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, client) {
        if (!interaction.isButton()) return;
        if (interaction.customId === "verify") {
            const role = interaction.guild.roles.cache.get(config.ponjo_development.verificationRole);
            const member = interaction.member;
            await member.roles.add(role);
            await interaction.reply({content: "You've verified yourself successfully.", ephemeral: true});
            if (member.roles.cache.has(role)) {
                await interaction.reply({content: "You're already verified!", ephemeral: true});
            }
        }
    }
}