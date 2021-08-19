import {emojis} from "../resources/config.json";
import Discord from "discord.js";
import QueryUtil from "minecraft-server-util";
import Gamedig from "gamedig";

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, client) {

        if (!interaction.isCommand()) return;

        if (interaction.commandName === "query") {

            const game = interaction.options.getString("game");
            const host = interaction.options.getString("host");

            switch (game) {

                case "minecraftbe":

                    await QueryUtil.queryFull(host, {port: parseInt(interaction.options.getInteger("port"))})

                        .then(async(response) => {

                            const host = response.host || "No response.";
                            const port = response.port || "No response.";
                            const gameType = response.gameType || "No response.";
                            const version = response.version || "No response.";
                            const software = response.software || "No response.";
                            const plugins = response.plugins.join(", ") || "No plugins listed.";
                            const players = response.players.join(", ") || "No response."
                            const online = response.onlinePlayers;
                            const max = response.maxPlayers;
                            const latency = response.roundTripLatency;

                            const embed1 = new Discord.MessageEmbed()
                                .setAuthor(`Query for: ${host}`, client.user.displayAvatarURL({dynamic: true}))
                                .setColor("#00e1ff")
                                .setDescription(`Host: **${host}**` + `\n` + `Connection latency: **${latency}ms**` + `\n` + `Version: **${version}**`)
                                .addField(`Online Player Count`, `**${online}**/**${max}**`)
                                .addField(`Online Player List`, players)
                                .addField(`Plugins`, plugins)
                                .setFooter(`Connect: ${host}:${port}`, client.user.displayAvatarURL({dynamic: true}))
                                .setTimestamp()

                            await interaction.reply({embeds: [embed1]});

                        }).catch(async(error) => {

                            console.error(error);

                            const errorEmbed = new Discord.MessageEmbed()
                                .setColor("RED")
                                .setDescription(`${emojis.error} Server is offline. Please try again later.`)

                            await interaction.reply({embeds: [errorEmbed]});

                        });

                    break;



                case "minecraft":

                    await Gamedig.query({
                        type: "minecraft",
                        host: host
                    }).then(async (state) => {

                        const connect = state.raw.vanilla.connect;
                        const latency = state.raw.vanilla.ping;
                        const online = state.players.length;
                        const maxOnline = state.maxplayers;

                        const embed1 = new Discord.MessageEmbed()
                            .setAuthor(`Query for: ${host}`, client.user.displayAvatarURL({dynamic: true}))
                            .setColor("#00e1ff")
                            .setDescription(`Connection latency: **${latency}ms**`)
                            .addField(`Online Player Count`, `**${online}**/**${maxOnline}**`)
                            .setFooter(`Connect: ${connect}`, client.user.displayAvatarURL({dynamic: true}))
                            .setTimestamp()

                        await interaction.reply({embeds: [embed1]});

                    }).catch(async (error) => {

                        console.log(error)

                        const errorEmbed = new Discord.MessageEmbed()
                            .setColor("RED")
                            .setDescription(`${emojis.error} Server is offline. Please try again later.`)

                        await interaction.reply({embeds: [errorEmbed]})

                    });
            }
        }
    }
}