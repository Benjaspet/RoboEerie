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

import {getNameHistoryByName, getUUID} from "mojang-minecraft-api";
import {ApplicationCommandData, Client, CommandInteraction, MessageEmbed} from "discord.js";
import {ApplicationCommand} from "../types/ApplicationCommand";
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import EmbedUtil from "../utils/EmbedUtil";
import Command from "../structs/Command";
import RoboEerieConstants from "../constants/RoboEerieConstants";
import Logger from "../structs/Logger";

export default class PlayerInfoCommand extends Command implements ApplicationCommand{

    private readonly client: Client;

    constructor(client: Client) {
        super("playerinfo", {
            name: "playerinfo",
            description: "Get information about a Minecraft: Java Edition player.",
            options: [
                {
                    name: "player",
                    description: "The player to look up, by name.",
                    type: ApplicationCommandOptionTypes.STRING,
                    required: true
                },
                {
                    name: "query",
                    description: "The type of information to return.",
                    type: ApplicationCommandOptionTypes.STRING,
                    required: true,
                    choices: [
                        {
                            name: "Name History",
                            value: "name-history"
                        },
                        {
                            name: "Skin Data",
                            value: "skin"
                        },
                        {
                            name: "Player Head",
                            value: "head"
                        },
                        {
                            name: "Get UUID",
                            value: "uuid"
                        },
                        {
                            name: "Raw Skin",
                            value: "raw"
                        }
                    ]
                }
            ]
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        const player = interaction.options.getString("player");
        const query = interaction.options.getString("query"); let uuid;
        await getUUID(player)
            .then(data => {
                uuid = data.id;
            }).catch(async error => {
                Logger.error(error);
                return void await interaction.reply({embeds: [EmbedUtil.getErrorEmbed("Invalid username. Please try again.")]});
            });
        switch (query) {
            case "name-history":
                await getNameHistoryByName(player)
                    .then(data => {
                        const names = data.map(e => e.name).join(", ");
                        const embed = new MessageEmbed()
                            .setTitle(player + "'s Usernames")
                            .setColor(RoboEerieConstants.DEFAULT_EMBED_COLOR)
                            .setDescription(names)
                            .setFooter({text: "RoboEerie", iconURL: this.client.user.displayAvatarURL({dynamic: true})})
                            .setTimestamp()
                        return interaction.reply({embeds: [embed]});
                    }).catch(async error => {
                        Logger.error(error);
                        return void await interaction.reply({embeds: [EmbedUtil.getErrorEmbed("Previous usernames could not be found.")]});
                    });
                break;
            case "skin":
                const timestamp = Math.round((new Date()).getTime() / 1000);
                const embed2 = new MessageEmbed()
                    .setAuthor({name: player + "'s Skin", url: "https://crafatar.com/renders/head/" + uuid})
                    .setThumbnail("https://crafatar.com/renders/body/" + uuid)
                    .setColor(RoboEerieConstants.DEFAULT_EMBED_COLOR)
                    .setDescription(`You are viewing ${player}'s skin currently. This API request was sent: <t:${timestamp}>`)
                    .setFooter({text: "RoboEerie", iconURL: this.client.user.displayAvatarURL({dynamic: true})})
                    .setTimestamp()
                return void await interaction.reply({embeds: [embed2]});
            case "raw":
                const embed3 = new MessageEmbed()
                    .setAuthor({name: player + "'s Skin", url: "https://crafatar.com/renders/head/" + uuid})
                    .setColor(RoboEerieConstants.DEFAULT_EMBED_COLOR)
                    .setImage("https://crafatar.com/skins/" + uuid)
                    .setFooter({text: "RoboEerie", iconURL: this.client.user.displayAvatarURL({dynamic: true})})
                    .setTimestamp()
                return void await interaction.reply({embeds: [embed3]});
            case "head":
                const embed = new MessageEmbed()
                    .setTitle(player + "'s Head")
                    .setImage("https://crafatar.com/renders/head/" + uuid)
                    .setColor(RoboEerieConstants.DEFAULT_EMBED_COLOR)
                    .setFooter({text: "RoboEerie", iconURL: this.client.user.displayAvatarURL({dynamic: true})})
                    .setTimestamp()
                return interaction.reply({embeds: [embed]});
            case "uuid":
                const embed4 = new MessageEmbed()
                    .setAuthor({name: player + "'s Skin", url: "https://crafatar.com/renders/head/" + uuid})
                    .setColor(RoboEerieConstants.DEFAULT_EMBED_COLOR)
                    .setDescription("UUID: `" + uuid + "`")
                    .setFooter({text: "RoboEerie", iconURL: this.client.user.displayAvatarURL({dynamic: true})})
                    .setTimestamp()
                return void await interaction.reply({embeds: [embed4]});
        }
    }

    public getName(): string {
        return this.name;
    }

    public getCommandData(): ApplicationCommandData {
        return this.data;
    }
}