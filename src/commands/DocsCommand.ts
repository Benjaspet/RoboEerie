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
import Command from "../structs/Command";
import RoboEerieConstants from "../constants/RoboEerieConstants";

export default class DocsCommand extends Command implements ApplicationCommand {

    private readonly client: Client;

    constructor(client: Client) {
        super("docs", {
            name: "docs",
            description: "Fetch Discord.js documentation.",
            options: [
                {
                    name: "query",
                    description: "The query to search the documentation for.",
                    type: ApplicationCommandOptionTypes.STRING,
                    required: true
                }
            ]
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        try {
            const query: string = interaction.options.getString("query");
            const url = `https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(query)}`;
            const documentationFetch = await fetch(url);
            const response = await documentationFetch.json();
            const embed = new MessageEmbed()
                .setAuthor({name: response.author.name, iconURL: "https://cdn.discordapp.com/emojis/851461487498493952.png?v=1"})
                .setURL(response.author.url)
                .setColor(RoboEerieConstants.DEFAULT_EMBED_COLOR)
                .setDescription(response.description)
                .addField("Wanna view the source?", `Simply [click here](https://discord.js.org/#/docs/main/stable/general/welcome).`)
                .setFooter({text: "RoboEerie", iconURL: this.client.user.displayAvatarURL({dynamic: true})})
                .setTimestamp();
            return void await interaction.reply({embeds: [embed]});
        } catch (error) {
            return void await interaction.reply({content: "Unable to fetch a response."});
        }
    }

    public getName(): string {
        return this.name;
    }

    public getCommandData(): ApplicationCommandData {
        return this.data;
    }
}