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
import TagUtil from "../utils/database/TagUtil";
import EmbedUtil from "../utils/EmbedUtil";
import Command from "../structs/Command";
import RoboEerieConstants from "../constants/RoboEerieConstants";

export default class TagCommand extends Command implements ApplicationCommand{

    private readonly client: Client;

    constructor(client: Client) {
        super("tag", {
            name: "tag",
            description: "Manage & search for tags.",
            options: [
                {
                    name: "make",
                    description: "Make a custom tag.",
                    type: ApplicationCommandOptionTypes.SUB_COMMAND,
                    options: [
                        {
                            name: "tag",
                            description: "The name of the tag to create.",
                            type: ApplicationCommandOptionTypes.STRING,
                            required: true,
                            autocomplete: true
                        }
                    ]
                },
                {
                    name: "edit",
                    description: "Edit a tag that you own.",
                    type: ApplicationCommandOptionTypes.SUB_COMMAND,
                    options: [
                        {
                            name: "tag",
                            description: "The name of the tag to edit.",
                            type: ApplicationCommandOptionTypes.STRING,
                            required: true,
                            autocomplete: true
                        }
                    ]
                },
                {
                    name: "search",
                    description: "Search for a tag by name.",
                    type: ApplicationCommandOptionTypes.SUB_COMMAND,
                    options: [
                        {
                            name: "tag",
                            description: "The name of the tag to search for.",
                            type: ApplicationCommandOptionTypes.STRING,
                            required: true,
                            autocomplete: true
                        }
                    ]
                },
                {
                    name: "get",
                    description: "Get a tag by name.",
                    type: ApplicationCommandOptionTypes.SUB_COMMAND,
                    options: [
                        {
                            name: "tag",
                            description: "The name of the tag to find.",
                            type: ApplicationCommandOptionTypes.STRING,
                            required: true,
                            autocomplete: true
                        }
                    ]
                },
                {
                    name: "delete",
                    description: "Delete a tag that you own.",
                    type: ApplicationCommandOptionTypes.SUB_COMMAND,
                    options: [
                        {
                            name: "tag",
                            description: "The name of the tag to delete.",
                            type: ApplicationCommandOptionTypes.STRING,
                            required: true,
                            autocomplete: true
                        }
                    ]
                }
            ]
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        const tag = interaction.options.getString("tag").toLowerCase();
        await interaction.deferReply();
        switch (interaction.options.getSubcommand()) {
            case "make":
                const exists = await TagUtil.tagExists(tag);
                if (exists) {
                    return void await interaction.editReply({content: "A tag with that ID already exists."});
                } else {
                    const filter = message => message.author.id === interaction.user.id;
                    const replyContent = `Cool, the tag's name is ${tag}. \nWhat would you like the tag's content to be? Type it below.\nType **abort** or **stop** to abort the tag making process.`;
                    await interaction.editReply({content: replyContent})
                        .then(async () => {
                            await interaction.channel.awaitMessages({filter, max: 1, time: 60000, errors: ["time"]})
                                .then(async collected => {
                                    const cancelKeywords = ["abort", "quit", "stop", "end"];
                                    if (cancelKeywords.includes(collected.first().content.toLowerCase())) {
                                        return await interaction.channel.send("Tag edit process cancelled.");
                                    }
                                    await TagUtil.createTag(tag, collected.first().content, interaction.user.id, interaction.guild.id)
                                        .then(async () => {
                                            return await interaction.channel.send({content: `Created the **${tag}** tag successfully.`});
                                        })
                                        .catch(async error => {
                                            return await interaction.channel.send({embeds: [EmbedUtil.getErrorEmbed(error.msg)]});
                                        });
                                })
                                .catch(async () => {
                                    return void await interaction.channel.send({content: "You didn't enter anything in time. Tag creation process cancelled."});
                                });
                        });
                }
                break;
            case "edit":
                await TagUtil.searchGlobalTag(tag)
                    .then(async result => {
                        if (result.author === interaction.user.id) {
                            const filter = message => message.author.id === interaction.user.id;
                            const response = `Nice, you own the **${tag}** tag. Please enter your edits to its content below.`;
                            await interaction.editReply({content: response})
                                .then(async () => {
                                    await interaction.channel.awaitMessages({filter, max: 1, time: 60000, errors: ["time"]})
                                        .then(async collected => {
                                            const cancelKeywords = ["abort", "quit", "stop", "end"];
                                            if (cancelKeywords.includes(collected.first().content.toLowerCase())) {
                                                return void await interaction.channel.send("Tag edit process cancelled.");
                                            }
                                            await TagUtil.editTag(tag, collected.first().content)
                                                .then(async () => {
                                                    return void await interaction.channel.send({content: `Edited the **${tag}** tag successfully.`});
                                                })
                                                .catch(async error => {
                                                    return void await interaction.channel.send({embeds: [EmbedUtil.getErrorEmbed(error.msg)]});
                                                });
                                        })
                                        .catch(async () => {
                                            return await interaction.channel.send({content: "You didn't enter anything in time. Tag edit process cancelled."});
                                        });
                                });
                        } else {
                            return void await interaction.editReply({embeds: [EmbedUtil.getErrorEmbed("You don't own that tag.")]});
                        }
                    })
                    .catch(async () => {
                        return void await interaction.editReply({embeds: [EmbedUtil.getErrorEmbed("You don't own that tag.")]});
                    });
                break;
            case "search":
                await TagUtil.findSimilarTags(tag)
                    .then(async result => {
                        const data = [];
                        result.map(obj => {
                            data.push(obj.tag);
                        });
                        if (data.length == 0) {
                            return await interaction.editReply({embeds: [EmbedUtil.getErrorEmbed("Could not find that tag.")]});
                        }
                        const embed: MessageEmbed = new MessageEmbed();
                        embed.setTitle(`Search results for ${tag}:`);
                        embed.setColor(RoboEerieConstants.DEFAULT_EMBED_COLOR);
                        embed.setDescription("" + data.map(x => `• ${x}`).join("\n"));
                        return void await interaction.editReply({embeds: [embed]});
                    })
                    .catch(async () => {
                        return void await interaction.editReply({embeds: [EmbedUtil.getErrorEmbed("Could not find that tag.")]});
                    });
                break;
            case "get":
                await TagUtil.searchGlobalTag(tag)
                    .then(async result => {
                        if (result) return void await interaction.editReply({content: result.content});
                    })
                    .catch(async () => {
                        await TagUtil.findSimilarTags(tag)
                            .then(async result => {
                                const data = [];
                                result.map(obj => {
                                    data.push(obj.tag);
                                });
                                if (data.length == 0) {
                                    return await interaction.editReply({embeds: [EmbedUtil.getErrorEmbed("Could not find that tag.")]});
                                }
                                const embed = new MessageEmbed()
                                    .setTitle("Tag not found. Did you mean...")
                                    .setColor(RoboEerieConstants.DEFAULT_EMBED_COLOR)
                                    .setDescription("" + data.map(x => `• ${x}`).join("\n"));
                                return void await interaction.editReply({embeds: [embed]});
                            })
                            .catch(async () => {
                                return void await interaction.editReply({embeds: [EmbedUtil.getErrorEmbed("Could not find that tag.")]});
                            });
                    });
                break;
            case "delete":
                await TagUtil.searchGlobalTag(tag)
                    .then(async result => {
                        if (result.author === interaction.user.id) {
                            await TagUtil.deleteTag(result.tag)
                                .then(async () => {
                                    return void await interaction.editReply({content: `Deleted the **${tag}** tag successfully.`});
                                }).catch(async () => {
                                    return void await interaction.editReply({embeds: [EmbedUtil.getErrorEmbed("That tag was not found.")]});
                                });
                        } else {
                            return void await interaction.editReply({embeds: [EmbedUtil.getErrorEmbed("You don't own that tag.")]});
                        }
                    }).catch(async () => {
                        return void await interaction.editReply({embeds: [EmbedUtil.getErrorEmbed("That tag was not found.")]});
                    });
                break;
        }
    }

    public getName(): string {
        return this.name;
    }

    public getCommandData(): ApplicationCommandData {
        return this.data;
    }
}