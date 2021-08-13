import {emojis} from "../resources/config.json";
import Discord from "discord.js";

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, client) {

        if (!interaction.isCommand()) return;

        if (interaction.commandName === "send") {

            const component = interaction.options.getString("component");
            const channel = interaction.options.getChannel("channel");

            switch (component) {

                case "verification-message":

                    const embed = new Discord.MessageEmbed()
                        .setTitle("Welcome to the Ponjo Development server!")
                        .setColor("#00e1ff")
                        .setDescription("In order to join the server fully and gain access to all channels, please react to the message below. By reacting, you are agreeing to the server rules and to abide by Discord's Terms of Service. We hope you enjoy your stay!")
                        .setFooter("Ponjo Team", client.user.displayAvatarURL({dynamic: true}))
                        .setTimestamp()

                    const row = new Discord.MessageActionRow()
                        .addComponents(
                            new Discord.MessageButton()
                                .setCustomId("verify")
                                .setLabel("Verify yourself!")
                                .setStyle("SECONDARY")
                                .setEmoji(emojis.success)
                        );

                    await interaction.reply({content: "The component has been sent successfully."});
                    await channel.send({embeds: [embed], components: [row]});
                    break;

            }
        }
    }
}