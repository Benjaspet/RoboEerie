/*
 * Copyright © 2022 Ben Petrillo. All rights reserved.
 *
 * Project licensed under the MIT License: https://www.mit.edu/~amini/LICENSE.md
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * All portions of this software are available for public use, provided that
 * credit is given to the original author(s).
 */

import {ApplicationCommandData, Client, CommandInteraction, MessageEmbed} from "discord.js";
import {ApplicationCommand} from "../types/ApplicationCommand";
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import * as QueryUtil from "minecraft-server-util";
import Utilities from "../utils/Utilities";
import Command from "../structs/Command";
import RoboEerieConstants from "../constants/RoboEerieConstants";
import Logger from "../structs/Logger";

export default class QueryCommand extends Command implements ApplicationCommand {

    private readonly client: Client;

    constructor(client: Client) {
        super("query", {
            name: "query",
            description: "Query a game server of your choice.",
            options: [
                {
                    name: "game",
                    description: "The type of game server you'd like to query.",
                    type: ApplicationCommandOptionTypes.STRING,
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
                    type: ApplicationCommandOptionTypes.STRING,
                    required: true
                },
                {
                    name: "port",
                    description: "The port of the host to query.",
                    type: ApplicationCommandOptionTypes.INTEGER,
                    required: true
                }
            ]
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        const game: string = interaction.options.getString("game");
        const host: string = interaction.options.getString("host");
        let embed: MessageEmbed;
        await interaction.deferReply();
        switch (game) {
            case "minecraftbe":
                await QueryUtil.queryFull(host, {port: interaction.options.getInteger("port"), timeout: 5000})
                    .then(async response => {
                        const host = response.host || "No response.";
                        const port = response.port || "No response.";
                        const version = response.version || "No response.";
                        const plugins = response.plugins.join(", ") || "No plugins listed.";
                        let players = response.players.join(", ") || "No response."
                        if (players.length > 1000) players = "Too many to list.";
                        const online = response.onlinePlayers;
                        const max = response.maxPlayers;
                        const latency = response.roundTripLatency;
                        await Utilities.sleep(2000);
                        embed = new MessageEmbed()
                            .setAuthor({name: `Query for: ${host}`, iconURL: this.client.user.displayAvatarURL({dynamic: true})})
                            .setColor(RoboEerieConstants.DEFAULT_EMBED_COLOR)
                            .setDescription(`Host: **${host}**` + `\n` + `Connection latency: **${latency}ms**` + `\n` + `Version: **${version}**`)
                            .addField(`Online Player Count`, `**${online}**/**${max}**`)
                            .addField(`Online Player List`, players)
                            .addField(`Plugins`, plugins)
                            .setFooter({text: `Connect: ${host}:${port}`, iconURL: this.client.user.displayAvatarURL({dynamic: true})})
                            .setTimestamp();
                        return void await interaction.editReply({embeds: [embed]});
                    }).catch(async error => {
                        Logger.error(error);
                        embed = new MessageEmbed()
                            .setColor("RED")
                            .setDescription(`${RoboEerieConstants.EMOJI_ERROR} Server is offline. Please try again later.`);
                        return void await interaction.editReply({embeds: [embed]});
                    });
                break;
            case "minecraft":
                await QueryUtil.status(host, {port: interaction.options.getInteger("port"), timeout: 5000})
                    .then(async response => {
                        const host = response.host;
                        const port = response.port;
                        const protocol = response.protocolVersion;
                        const online = response.onlinePlayers;
                        const max = response.maxPlayers;
                        const latency = response.roundTripLatency;
                        const embed = new MessageEmbed()
                            .setAuthor({name: `Query for: ${host}`, iconURL: this.client.user.displayAvatarURL({dynamic: true})})
                            .setColor(RoboEerieConstants.DEFAULT_EMBED_COLOR)
                            .setDescription(`Host: **${host}**` + `\n` + `Connection latency: **${latency}ms**` + `\n` + `Protocol: **${protocol}**`)
                            .addField(`Online Player Count`, `**${online}**/**${max}**`)
                            .setFooter({text: `Connect: ${host}:${port}`, iconURL: this.client.user.displayAvatarURL({dynamic: true})})
                            .setTimestamp();
                        return void await interaction.editReply({embeds: [embed]});
                    }).catch(async error => {
                        Logger.error(error);
                        embed = new MessageEmbed()
                            .setColor("RED")
                            .setDescription(`${RoboEerieConstants.EMOJI_ERROR} Server is offline. Please try again later.`)
                        return void await interaction.editReply({content: `Query for **${host}** failed.`, embeds: [embed]});
                    });
        }
    }

    public getName(): string {
        return this.name;
    }

    public getCommandData(): ApplicationCommandData {
        return this.data;
    }
}