import {developer} from "../resources/config.json";
import SlashCommandUtil from "../utils/slash/SlashCommandUtil";

module.exports = {
    name: "interactionCreate",
    once: true,
    async execute(interaction, client) {

        if (!interaction.isCommand()) return;

        if (interaction.commandName === "deploy") {

            if (interaction.user.id !== developer.owner) {

                return await interaction.reply({content: "You are not the developer of this bot."});

            }

            await SlashCommandUtil.deployAllSlashCommands(client, false);
            await interaction.reply({content: "Slash commands successfully deployed."});

        }
    }
}