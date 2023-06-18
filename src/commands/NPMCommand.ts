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
import EmbedUtil from "../utils/EmbedUtil";

export default class NPMCommand extends Command implements ApplicationCommand{

    private readonly client: Client;

    constructor(client: Client) {
        super("npm", {
            name: "npm",
            description: "Look up an NPM package.",
            options: [
                {
                    name: "package",
                    description: "The NPM package to search for.",
                    type: ApplicationCommandOptionTypes.STRING,
                    required: true
                }
            ]
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        const npmPackage: string = interaction.options.getString("package");
        try {
            await fetch('https://api.npms.io/v2/search?q=' + npmPackage)
                .then(res => res.json())
                .then(async data => {
                    const pkg = data.results[0].package;
                    const embed = new MessageEmbed()
                        .setTitle(pkg.name)
                        .setColor("#00e1ff")
                        .setURL(pkg.links.npm)
                        .setThumbnail("https://www.npmjs.com/npm-avatar/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXJVUkwiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci80NmQ4ZDAwZTE5MGJlNjQ3MDUzZjdkOTdmZDA0NzhlND9zaXplPTQ5NiZkZWZhdWx0PXJldHJvIn0.ZIKi6beTgJXz4FjR7yoEjEbznlYVMp91bmtG4LYW-0E")
                        .setDescription(`${pkg.description}\n\n**Author:** ${pkg.author ? pkg.author.name : 'none'}\n**Version:** ${pkg.version}\n**Repository:** ${pkg.links.repository ? pkg.links.repository : 'none'}\n**Maintainers:** ${pkg.maintainers ? pkg.maintainers.map(e => e.username).join(', ') : 'none'}\n**Keywords:** ${pkg.keywords ? pkg.keywords.join(', ') : 'none'}`)
                        .setTimestamp()
                    return void await interaction.reply({embeds: [embed]});
                });
        } catch (error) {
            return void await interaction.reply({embeds: [EmbedUtil.getErrorEmbed("Could not find the specified NPM package.")]});
        }
    }

    public getName(): string {
        return this.name;
    }

    public getCommandData(): ApplicationCommandData {
        return this.data;
    }
}