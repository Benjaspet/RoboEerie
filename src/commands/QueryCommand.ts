import config from "../resources/Config";
import * as Discord from "discord.js";
import * as QueryUtil from "minecraft-server-util";
import PonjoUtil from "../utils/PonjoUtil";
import {Client} from "discord.js";
import {PonjoCommand} from "../interfaces/PonjoCommand";
import {SlashCommandOptions} from "../interfaces/CommandOptions";

export default class QueryCommand implements PonjoCommand {

    public name: string = "query";
    public once: boolean = false;
    public enabled: boolean = true;
    public description: string = "Query a game server of your choice.";
    public aliases: string[] = [];
    protected client: Discord.Client;

    constructor(client: Client) {
        this.enabled = true;
        this.client = client;
    }

    public async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            const game = interaction.options.getString("game");
            const host = interaction.options.getString("host");
            switch (game) {
                case "minecraftbe":
                    const embedPre1 = new Discord.MessageEmbed()
                        .setDescription(`${config.emojis.loading} Querying ${host} on port ${parseInt(interaction.options.getInteger("port"))}...`)
                        .setColor("#00e1ff")
                    await interaction.reply({embeds: [embedPre1]});
                    await QueryUtil.queryFull(host, {port: parseInt(interaction.options.getInteger("port")), timeout: 5000})
                        .then(async response => {
                            const host = response.host || "No response.";
                            const port = response.port || "No response.";
                            const version = response.version || "No response.";
                            const plugins = response.plugins.join(", ") || "No plugins listed.";
                            let players = response.players.join(", ") || "No response."
                            if (players.length > 1000) {
                                players = "Too many to list.";
                            }
                            const online = response.onlinePlayers;
                            const max = response.maxPlayers;
                            const latency = response.roundTripLatency;
                            await PonjoUtil.sleep(2000);
                            const embed2 = new Discord.MessageEmbed()
                                .setAuthor(`Query for: ${host}`, this.client.user.displayAvatarURL({dynamic: true}))
                                .setColor("#00e1ff")
                                .setDescription(`Host: **${host}**` + `\n` + `Connection latency: **${latency}ms**` + `\n` + `Version: **${version}**`)
                                .addField(`Online Player Count`, `**${online}**/**${max}**`)
                                .addField(`Online Player List`, players)
                                .addField(`Plugins`, plugins)
                                .setFooter(`Connect: ${host}:${port}`, this.client.user.displayAvatarURL({dynamic: true}))
                                .setTimestamp()
                            return await interaction.editReply({content: `Query for **${host}** succeeded.`, embeds: [embed2]});
                        }).catch(async error => {
                            console.error(error);
                            await PonjoUtil.sleep(2000);
                            const errorEmbed = new Discord.MessageEmbed()
                                .setColor("RED")
                                .setDescription(`${config.emojis.error} Server is offline. Please try again later.`)
                            return await interaction.editReply({content: `Query for **${host}** failed.`, embeds: [errorEmbed]});
                        });
                    break;
                case "minecraft":
                    const embedPre2 = new Discord.MessageEmbed()
                        .setDescription(`${config.emojis.loading} Querying ${host} on port ${parseInt(interaction.options.getInteger("port"))}...`)
                        .setColor("#00e1ff")
                    await interaction.reply({embeds: [embedPre2]});
                    await QueryUtil.status(host, {port: parseInt(interaction.options.getInteger("port")), timeout: 5000})
                        .then(async response => {
                            const host = response.host;
                            const port = response.port;
                            const protocol = response.protocolVersion;
                            const online = response.onlinePlayers;
                            const max = response.maxPlayers;
                            const latency = response.roundTripLatency;
                            await PonjoUtil.sleep(2000);
                            const embed2 = new Discord.MessageEmbed()
                                .setAuthor(`Query for: ${host}`, this.client.user.displayAvatarURL({dynamic: true}))
                                .setColor("#00e1ff")
                                .setDescription(`Host: **${host}**` + `\n` + `Connection latency: **${latency}ms**` + `\n` + `Protocol: **${protocol}**`)
                                .addField(`Online Player Count`, `**${online}**/**${max}**`)
                                .setFooter(`Connect: ${host}:${port}`, this.client.user.displayAvatarURL({dynamic: true}))
                                .setTimestamp()
                            return await interaction.editReply({content: `Query for **${host}** succeeded.`, embeds: [embed2]});
                        }).catch(async error => {
                            console.error(error);
                            await PonjoUtil.sleep(2000);
                            const errorEmbed = new Discord.MessageEmbed()
                                .setColor("RED")
                                .setDescription(`${config.emojis.error} Server is offline. Please try again later.`)
                            return await interaction.editReply({content: `Query for **${host}** failed.`, embeds: [errorEmbed]});
                        });
            }
        }
    }

    public slashData: object = <object> {
        name: this.name,
        description: this.description,
        options: [
            {
                name: "game",
                description: "The type of game server you'd like to query.",
                type: SlashCommandOptions.STRING,
                required: true,
                choices: [
                    {
                        name: "Minecraft: Bedrock",
                        value: "minecraftbe"
                    },
                    {
                        name: "Minecraft: Java",
                        value: "minecraft"
                    }
                ]
            },
            {
                name: "host",
                description: "The IP address of the host to query.",
                type: SlashCommandOptions.STRING,
                required: true
            },
            {
                name: "port",
                description: "The port of the host to query.",
                type: SlashCommandOptions.STRING,
                required: true
            }
        ]
    };

}