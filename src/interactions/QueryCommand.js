import {emojis} from "../resources/config.json";
import Discord from "discord.js";
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

                    await Gamedig.query({
                        type: "minecraftbe",
                        host: host
                    }).then(async (state) => {

                        const connect = state.raw.gamespy.connect;
                        const motd = state.raw.gamespy.name;
                        const latency = state.raw.gamespy.ping;
                        const online = state.raw.bedrock.players;
                        const maxOnline = state.maxplayers;
                        const playerList = state.players
                            .map(e => e.name).join(", ");

                        const embed1 = new Discord.MessageEmbed()
                            .setAuthor(`Query for: ${host}`, client.user.displayAvatarURL({dynamic: true}))
                            .setColor("#00e1ff")
                            .setDescription(`MOTD: **${motd}**` + `\n` + `Connection latency: **${latency}ms**`)
                            .addField(`Online Player Count`, `**${online}**/**${maxOnline}**`)
                            .addField(`Online Player List`, playerList)
                            .setFooter(`Connect: ${connect}`, client.user.displayAvatarURL({dynamic: true}))
                            .setTimestamp()

                        await interaction.reply({embeds: [embed1]});

                    }).catch(async (error) => {

                        const errorEmbed = new Discord.MessageEmbed()
                            .setColor("RED")
                            .setDescription(`${emojis.error} Server is offline. Please try again later.`)

                        await interaction.reply({embeds: [errorEmbed]})

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