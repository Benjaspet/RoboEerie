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

import {ApplicationCommandData, Client, CommandInteraction, GuildBasedChannel, MessageEmbed, Permissions, Snowflake, TextChannel} from "discord.js";
import {ApplicationCommand} from "../types/ApplicationCommand";
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import Command from "../structs/Command";
import RoboEerieConstants from "../constants/RoboEerieConstants";

export default class SendCommand extends Command implements ApplicationCommand {

    private readonly client: Client;

    constructor(client: Client) {
        super("send", {
            name: "send",
            description: "Send a component to a channel.",
            options: [
                {
                    name: "message",
                    description: "The message, in an embed, to send.",
                    type: ApplicationCommandOptionTypes.STRING,
                    required: true
                },
                {
                    name: "channel",
                    description: "The channel to send the component to.",
                    type: ApplicationCommandOptionTypes.CHANNEL,
                    required: true
                }
            ]
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        const staffPermissions = <Permissions> interaction.member.permissions;
        if (!staffPermissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return void await interaction.reply({content: "You don't have the required permissions to do this.", ephemeral: true});
        }
        const channelId: Snowflake = interaction.options.getChannel("channel").id;
        const channel: GuildBasedChannel = interaction.guild.channels.cache.get(channelId);
        const content = interaction.options.getString("message"); let embed;
        if (channel instanceof TextChannel) {
            embed = new MessageEmbed()
                .setColor(RoboEerieConstants.DEFAULT_EMBED_COLOR)
                .setDescription(content)
                .setFooter({text: "R. Eerie", iconURL: this.client.user.displayAvatarURL({dynamic: true})})
                .setTimestamp();
            await interaction.reply({content: "The component has been sent successfully.", ephemeral: true});
            return void await channel.send({embeds: [embed]});
        } else {
            return void await interaction.reply({content: "The channel is not a text channel.", ephemeral: true});
        }
    }

    public getName(): string {
        return this.name;
    }

    public getCommandData(): ApplicationCommandData {
        return this.data;
    }
}