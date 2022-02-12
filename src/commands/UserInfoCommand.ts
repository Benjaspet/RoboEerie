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

import {ApplicationCommandData, Client, CommandInteraction, Interaction, MessageEmbed} from "discord.js";
import {ApplicationCommand} from "../types/ApplicationCommand";
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import Command from "../structs/Command";
import RoboEerieConstants from "../constants/RoboEerieConstants";

export default class UserInfoCommand extends Command implements ApplicationCommand {

    private readonly client: Client;

    constructor(client: Client) {
        super("userinfo", {
            name: "userinfo",
            description: "View information about a specific user.",
            options: [
                {
                    name: "user",
                    description: "The user to view.",
                    type: ApplicationCommandOptionTypes.USER,
                    required: true
                }
            ]
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        const user = await interaction.options.getUser("user");
        const target = interaction.guild.members.cache.get(user.id);
        const embed = new MessageEmbed()
            .setAuthor({name: target.user.tag, iconURL: target.displayAvatarURL({dynamic: true, size: 512})})
            .setColor(RoboEerieConstants.DEFAULT_EMBED_COLOR)
            .setThumbnail(target.user.displayAvatarURL({dynamic: true, size: 512}))
            .addFields([
                {
                    name: "User ID",
                    value: target.id,
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
    }

    public getName(): string {
        return this.name;
    }

    public getCommandData(): ApplicationCommandData {
        return this.data;
    }
}