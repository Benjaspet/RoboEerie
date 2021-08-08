import {developer} from "../resources/config.json";
import SlashCommandUtil from "../utils/slash/SlashCommandUtil";
import * as Discord from "discord.js";

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, client) {

        if (!interaction.isCommand()) return;

        if (interaction.commandName === "avatar") {

            const member = interaction.options.getMember("user");

            const embed = new Discord.MessageEmbed()
                .setTitle(`${member.user.tag}'s Avatar`)
                .setImage(member.user.displayAvatarURL({dynamic: true, size: 512}))
                .setColor("#00e1ff")

            await interaction.reply({embeds: [embed]});

        }
    }
}