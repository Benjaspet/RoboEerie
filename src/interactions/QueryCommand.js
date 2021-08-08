import {emojis} from "../resources/config.json";
import Discord from "discord.js";
import fetch from "node-fetch";

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, client) {

        if (!interaction.isCommand()) return;

        if (interaction.commandName === "query") {

            const game = interaction.options.getString("game");

            switch (game) {

                case "query-bedrock":

                    const host = interaction.options.getString("host");
                    const port = interaction.options.getString("port");

                    await fetch(`https://api.mcsrvstat.us/bedrock/2/${host}`)
                        .then(response => response.json())
                        .then(async data => {

                            const onlinePlayers = data.players.online || null;
                            const maxPlayers = data.players.max || null;
                            const host = data.hostname || null;
                            const port = data.port || null;

                            const embed = new Discord.MessageEmbed()
                                .setAuthor(`Query for: ${host}`, client.user.displayAvatarURL({dynamic: true}))
                                .setColor("#00e1ff")
                                .addField(`Online Player Count`, `**${onlinePlayers}**/**${maxPlayers}**`)
                                .addField(`Connect`, `Host: ${host}\nPort: ${port}`)
                                .setFooter(`Ponjo`, client.user.displayAvatarURL({dynamic: true}))
                                .setTimestamp()

                            await interaction.reply({embeds: [embed]});

                        });

                    break;
            }
        }
    }
}