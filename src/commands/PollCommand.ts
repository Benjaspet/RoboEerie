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

import {ApplicationCommandData, Client, CommandInteraction, MessageEmbed, NewsChannel, TextChannel} from "discord.js";
import {ApplicationCommand} from "../types/ApplicationCommand";
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import Command from "../structs/Command";
import RoboEerieConstants from "../constants/RoboEerieConstants";
import Utilities from "../utils/Utilities";

export default class PollCommand extends Command implements ApplicationCommand{

    private readonly client: Client;

    constructor(client: Client) {
        super("poll", {
            name: "poll",
            description: "Create a poll for the guild.",
            options: [
                {
                    name: "channel",
                    description: "The channel to send the poll in.",
                    type: ApplicationCommandOptionTypes.CHANNEL,
                    required: true,
                },
                {
                    name: "description",
                    description: "The context/description of the poll.",
                    type: ApplicationCommandOptionTypes.STRING,
                    required: true
                }
            ]
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        const content = interaction.options.getString("description");
        const channel = interaction.options.getChannel("channel");
        if (channel instanceof TextChannel || channel instanceof NewsChannel) {
            await interaction.reply({content: "The poll was successfully published."});
            const embed = new MessageEmbed()
                .setTitle("Server Poll")
                .setColor(RoboEerieConstants.DEFAULT_EMBED_COLOR)
                .setDescription(content)
                .setFooter({text: interaction.user.tag, iconURL: this.client.user.displayAvatarURL({dynamic: true})})
                .setTimestamp()
            channel.send({embeds: [embed]})
                .then(async msg => {
                    await msg.react(RoboEerieConstants.EMOJI_SUCCESS);
                    await msg.react(RoboEerieConstants.EMOJI_ERROR);
                });
        } else {
            return void await interaction.reply({content: "The channel you specified is not a valid channel."});
        }
    }

    public getName(): string {
        return this.name;
    }

    public getCommandData(): ApplicationCommandData {
        return this.data;
    }
}