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
import fetch from "node-fetch";
import EmbedUtil from "../utils/EmbedUtil";
import Command from "../structs/Command";
import MrCodeAndWatchConstants from "../constants/MrCodeAndWatchConstants";

export default class UrbanCommand extends Command implements ApplicationCommand {

    private readonly client: Client;

    constructor(client: Client) {
        super("urban", {
            name: "urban",
            description: "Search the Urban Dictionary for a word.",
            options: [
                {
                    name: "query",
                    description: "The word or phrase to search for.",
                    type: ApplicationCommandOptionTypes.STRING,
                    required: true
                }
            ]
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        const query = interaction.options.getString("query");
        const parsedQuery = encodeURIComponent(query);
        try {
            await fetch(`https://api.urbandictionary.com/v0/define?term=${parsedQuery}`)
                .then((response) => response.json())
                .then(async (data) => {
                    const word = data.list[0].word;
                    const definition = data.list[0].definition.replaceAll("\r", "").replaceAll("[", "").replaceAll("]", "");
                    const permalink = data.list[0].permalink;
                    const upvotes = data.list[0].thumbs_up;
                    const downVotes = data.list[0].thumbs_down;
                    const embed = new MessageEmbed()
                        .setAuthor({name: word})
                        .setColor(MrCodeAndWatchConstants.DEFAULT_EMBED_COLOR)
                        .setDescription(`**URL:** [Click here](${permalink}).\n**Definition:** See below.` + `\n\n${definition}`)
                        .setFooter({text: `Ratings: 👍 ${upvotes} 👎 ${downVotes}`})
                    return void await interaction.reply({embeds: [embed]});
                });
        } catch (error) {
            return void await interaction.reply({embeds: [EmbedUtil.getErrorEmbed("The specified query could not be found.")]});
        }
    }

    public getName(): string {
        return this.name;
    }

    public getCommandData(): ApplicationCommandData {
        return this.data;
    }
}