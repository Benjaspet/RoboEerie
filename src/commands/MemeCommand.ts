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
import Command from "../structs/Command";
import fetch from "node-fetch";

export default class MemeCommand extends Command implements ApplicationCommand{

    private readonly client: Client;

    constructor(client: Client) {
        super("meme", {
            name: "meme",
            description: "View a random meme from a subreddit.",
            options: [
                {
                    name: "subreddit",
                    description: "The subreddit to send a meme from.",
                    type: ApplicationCommandOptionTypes.STRING,
                    required: false,
                    choices: [
                        {
                            name: "r/wholesomememes",
                            value: "wholesomememes"
                        },
                        {
                            name: "r/TerribleFacebookMemes",
                            value: "facebookmemes"
                        },
                        {
                            name: "r/DankMemes",
                            value: "dankmemes"
                        },
                        {
                            name: "r/MemeEconomy",
                            value: "memeeconomy"
                        },
                        {
                            name: "r/Memes",
                            value: "memes"
                        }
                    ]
                }
            ]
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        const subreddit: string = <string>interaction.options.getString("subreddit");
        await interaction.deferReply();
        if (!subreddit) {
            await fetch("https://meme-api.herokuapp.com/gimme")
                .then(response => response.json())
                .then(data => {
                    const embed = new MessageEmbed()
                        .setTitle(data.title)
                        .setColor("#00e1ff")
                        .setImage(data.url)
                        .setFooter({text: "Upvotes: " + data.ups + " | Posted by: " + data.author})
                    return void interaction.editReply({embeds: [embed]});
                });
        } else {
            await fetch("https://meme-api.herokuapp.com/gimme/" + subreddit)
                .then(response => response.json())
                .then(data => {
                    const embed: MessageEmbed = new MessageEmbed()
                        .setTitle(data.title)
                        .setColor("#00e1ff")
                        .setImage(data.url)
                        .setFooter({text: "Upvotes: " + data.ups + " | Posted by: " + data.author})
                    return void interaction.editReply({embeds: [embed]});
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