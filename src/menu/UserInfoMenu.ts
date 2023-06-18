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

import {ApplicationCommandData, Client, ContextMenuInteraction, MessageEmbed} from "discord.js";
import Logger from "../structs/Logger";
import MrCodeAndWatchConstants from "../constants/MrCodeAndWatchConstants";

export default class UserInfoMenu {

    public client: Client;
    public enabled: boolean;

    constructor(client: Client) {
        this.enabled = true;
        this.client = client;
    }

    public async execute(interaction: ContextMenuInteraction): Promise<void> {
        if (!interaction.isContextMenu()) return;
        if (interaction.commandName == "User Information") {
            try {
                const target = await interaction.guild.members.fetch(interaction.targetId);
                await target.user.fetch();
                const embed = new MessageEmbed()
                    .setAuthor({name: target.user.tag, iconURL: target.user.avatarURL({dynamic: true, size: 512})})
                    .setColor(MrCodeAndWatchConstants.DEFAULT_EMBED_COLOR)
                    .setThumbnail(target.user.avatarURL({dynamic: true, size: 512}))
                    .addFields([
                        {
                            name: "User ID",
                            value: target.user.id,
                            inline: false
                        },
                        {
                            name: "Timestamps",
                            value: `Joined guild: <t:${parseInt(String(target.joinedTimestamp / 1000))}:R>` + "\n" + `Account created: <t:${parseInt(String(target.user.createdTimestamp / 1000))}:R>`,
                            inline: false
                        },
                        {
                            name: "Roles",
                            value: target.roles.cache.map(role => role).join(" ").replace("@everyone", "") || "None.",
                            inline: false
                        }
                    ])
                    .setFooter({text: "RoboEerie", iconURL: this.client.user.displayAvatarURL({dynamic: true})})
                    .setTimestamp();
                return void await interaction.reply({embeds: [embed], ephemeral: true});
            } catch (error) {
                Logger.error(error);
            }
        }
    }

    public getCommandData(): ApplicationCommandData {
        return {
            name: "User Information",
            type: 2
        }
    }
}