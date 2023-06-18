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

import {ApplicationCommandData, Client, CommandInteraction, GuildMember, MessageEmbed, User} from "discord.js";
import {ApplicationCommand} from "../types/ApplicationCommand";
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import Command from "../structs/Command";
import axios from "axios";

export default class BannerCommand extends Command implements ApplicationCommand {

    private readonly client: Client;

    constructor(client: Client) {
        super("banner", {
            name: "banner",
            description: "Display the banner of the mentioned user.",
            options: [
                {
                    name: "user",
                    description: "The user whose banner you'd like to view.",
                    type: ApplicationCommandOptionTypes.USER,
                    required: true
                }
            ]
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        const user: User = interaction.options.getUser("user");
        const member: GuildMember = interaction.guild.members.cache.get(user.id);
        await interaction.deferReply();
        await axios.get(`https://discord.com/api/users/${member.id}`, {
            headers: {
                Authorization: `Bot ${this.client.token}`
            },
        }).then(async result => {
            const {banner, accent_color}: any = result.data;
            if (banner) {
                const extension = <any>banner.startsWith("a_") ? ".gif" : ".png";
                const url = `https://cdn.discordapp.com/banners/${member.id}/${banner}${extension}?size=1024`;
                const embed = new MessageEmbed()
                    .setTitle(`${member.user.username}'s Banner`)
                    .setColor(accent_color || "#00e1ff")
                    .setImage(url)
                return void await interaction.editReply({embeds: [embed]});
            } else {
                if (accent_color) {
                    axios.get(`https://www.thecolorapi.com/scheme?hex=${accent_color}&format=json`)
                        .then(async result => {
                            const {data} = result as any;
                            const hex = data.colors[0].hex.value;
                            const image = data.colors[0].image.bare;
                            const embed = new MessageEmbed()
                                .setTitle(`${member.user.tag}'s Accent Color`)
                                .setDescription(`**Hex:** \`${hex}\``)
                                .setThumbnail(image)
                            return void await interaction.editReply({embeds: [embed]});
                        });
                } else {
                    const embed = new MessageEmbed()
                        .setDescription(`${member.user.tag} does not have a banner.`)
                        .setColor("RED")
                    return interaction.editReply({embeds: [embed]});
                }
            }
        });
    }

    public getName(): string {
        return this.name;
    }

    public getCommandData(): ApplicationCommandData {
        return this.data;
    }
}
