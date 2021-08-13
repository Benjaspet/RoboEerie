import * as Discord from "discord.js";

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, client) {

        if (!interaction.isCommand()) return;

        if (interaction.commandName === "ping") {

            const embed = new Discord.MessageEmbed()
                .setTitle("Ponjo Bot | Latency")
                .setColor("#00e1ff")
                .setDescription(`Websocket latency: ${client.ws.ping}ms` + `\n` + `Interaction latency: ${interaction.createdTimestamp - Date.now()}ms`)
                .setFooter("Ponjo", client.user.displayAvatarURL({dynamic: true}))
                .setTimestamp()

            await interaction.reply({embeds: [embed]});

        }
    }
}