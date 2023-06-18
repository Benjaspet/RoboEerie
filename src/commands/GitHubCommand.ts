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
import MrCodeAndWatchConstants from "../constants/MrCodeAndWatchConstants";
import fetch from "node-fetch";

export default class GitHubCommand extends Command implements ApplicationCommand {

    private readonly client: Client;

    constructor(client: Client) {
        super("github", {
            name: "github",
            description: "View information on a user's GitHub account.",
            options: [
                {
                    name: "user",
                    description: "The GitHub username to search for.",
                    type: ApplicationCommandOptionTypes.STRING,
                    required: true
                }
            ]
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        const user: string = interaction.options.getString("user");
        await fetch(`https://api.github.com/users/${user}`)
            .then(res => res.json())
            .then(async body => {
                if (body.message) {
                    return await interaction.reply({content: "The user was not found.", ephemeral: true});
                }
                const {
                    login, avatar_url,
                    html_url, public_repos,
                    followers, following, location,
                    company, created_at, bio
                } = body;
                const embed = new MessageEmbed()
                    .setTitle(`${login} - GitHub`)
                    .setAuthor({name: `${login}'s GitHub Profile`, iconURL: avatar_url})
                    .setURL(html_url)
                    .setThumbnail(avatar_url)
                    .setColor(MrCodeAndWatchConstants.DEFAULT_EMBED_COLOR)
                    .setDescription(`‣ ${bio}` +
                        `\n‣ Public Repositories: ${public_repos}` +
                        `\n‣ Followers: ${followers}` +
                        `\n‣ Following: ${following}`)
                    .addFields(
                        {
                            name: "Company/Organization",
                            value: company || "None found.",
                            inline: false
                        },
                        {
                            name: "Account Location",
                            value: location || "None specified.",
                            inline: false
                        }
                    )
                    .setFooter({text: `Account created: ${created_at}`})
                return void await interaction.reply({embeds: [embed]})
            });
    }

    public getName(): string {
        return this.name;
    }

    public getCommandData(): ApplicationCommandData {
        return this.data;
    }
}