import * as Discord from "discord.js";
import {Client} from "discord.js";
import {PonjoCommand} from "../interfaces/PonjoCommand";
import {SlashCommandOptions} from "../interfaces/CommandOptions";
import TagUtil from "../utils/database/TagUtil";
import EmbedUtil from "../utils/EmbedUtil";

import * as environment from "dotenv";

environment.config();

export default class TagCommand implements PonjoCommand {

    public name: string = "tag";
    public once: boolean = false;
    public enabled: boolean = true;
    public description: string = "Manage & search for tags.";
    public aliases: string[] = [];
    protected client: Discord.Client;

    constructor(client: Client) {
        this.enabled = true;
        this.client = client;
    }

    public async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            const tag = interaction.options.getString("tag");
            switch (interaction.options.getSubcommand()) {
                case "make":
                    const exists = await TagUtil.tagExists(tag);
                    if (exists) {
                        return await interaction.reply({content: "Already exists."});
                    } else {
                        const filter = message => message.author.id === interaction.user.id;
                        const replyContent = `Cool, the tag's name is ${tag}. \nWhat would you like the tag's content to be? Type it below.\nType **abort** or **stop** to abort the tag making process.`;
                        await interaction.reply({content: replyContent})
                            .then(async () => {
                                await interaction.channel.awaitMessages({filter, max: 1, time: 60000, errors: ["time"]})
                                    .then(async collected => {
                                        const cancelKeywords = ["abort", "quit", "stop", "end"];
                                        if (cancelKeywords.includes(collected.first().content.toLowerCase())) {
                                            return await interaction.channel.send("Tag edit process cancelled.");
                                        }
                                        await TagUtil.createTag(tag, collected.first().content, interaction.user.id, interaction.guild.id)
                                            .then(async () => {
                                                return await interaction.channel.send({content: `Crated the **${tag}** tag successfully.`});
                                            })
                                            .catch(async error => {
                                                return await interaction.channel.send({embeds: [EmbedUtil.fetchEmbedByType(this.client, "error", error.msg)]});
                                            });
                                    })
                                    .catch(async () => {
                                        return await interaction.channel.send({content: "You didn't enter anything in time. Tag creation process cancelled."});
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
                                await interaction.reply({content: response})
                                    .then(async () => {
                                        await interaction.channel.awaitMessages({filter, max: 1, time: 60000, errors: ["time"]})
                                            .then(async collected => {
                                                const cancelKeywords = ["abort", "quit", "stop", "end"];
                                                if (cancelKeywords.includes(collected.first().content.toLowerCase())) {
                                                    return await interaction.channel.send("Tag edit process cancelled.");
                                                }
                                                await TagUtil.editTag(tag, collected.first().content)
                                                    .then(async () => {
                                                        return await interaction.channel.send({content: `Edited the **${tag}** tag successfully.`});
                                                    })
                                                    .catch(async error => {
                                                        return await interaction.channel.send({embeds: [EmbedUtil.fetchEmbedByType(this.client, "error", error.msg)]});
                                                    });
                                            })
                                            .catch(async () => {
                                                return await interaction.channel.send({content: "You didn't enter anything in time. Tag edit process cancelled."});
                                            });
                                    });
                            } else {
                                return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client, "error", "You don't own that tag.")]});
                            }
                        })
                        .catch(async () => {
                            return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client, "error", "You don't own that tag.")]});
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
                                return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client, "error", "Could not find that tag.")]});
                            }
                            const embed = new Discord.MessageEmbed();
                            embed.setTitle(`Search results for ${tag}:`);
                            embed.setColor("#00e1ff");
                            embed.setDescription("" + data.map(x => `• ${x}`).join("\n"));
                            return await interaction.reply({embeds: [embed]});
                        })
                        .catch(async () => {
                            return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client, "error", "Could not find that tag.")]});
                        });
                    break;
                case "get":
                    await TagUtil.searchGlobalTag(tag)
                        .then(async result => {
                            if (result) {
                                return await interaction.reply({content: result.content});
                            }
                        })
                        .catch(async () => {
                            await TagUtil.findSimilarTags(tag)
                                .then(async result => {
                                    const data = [];
                                    result.map(obj => {
                                        data.push(obj.tag);
                                    });
                                    if (data.length == 0) {
                                        return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client, "error", "Could not find that tag.")]});
                                    }
                                    const embed = new Discord.MessageEmbed();
                                    embed.setTitle("Tag not found. Did you mean...");
                                    embed.setColor("#00e1ff");
                                    embed.setDescription("" + data.map(x => `• ${x}`).join("\n"));
                                    return await interaction.reply({embeds: [embed]});
                                })
                                .catch(async () => {
                                    return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client, "error", "Could not find that tag.")]});
                                });
                        });
                    break;
                case "delete":
                    await TagUtil.searchGlobalTag(tag)
                        .then(async result => {
                            if (result.author === interaction.user.id) {
                                await TagUtil.deleteTag(result.tag)
                                    .then(async () => {
                                        return await interaction.reply({content: `Deleted the **${tag}** tag successfully.`});
                                    }).catch(async () => {
                                        return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client, "error", "That tag was not found.")]});
                                    });
                            } else {
                                return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client, "error", "You don't own that tag.")]});
                            }
                        }).catch(async () => {
                            return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client, "error", "That tag was not found.")]});
                        });
                    break;
            }
        }
    }

    public slashData: object = {
        name: this.name,
        description: this.description,
        options: [
            {
                name: "make",
                description: "Make a custom tag.",
                type: SlashCommandOptions.SUB_COMMAND,
                options: [
                    {
                        name: "tag",
                        description: "The name of the tag to create.",
                        type: SlashCommandOptions.STRING,
                        required: true
                    }
                ]
            },
            {
                name: "edit",
                description: "Edit a tag that you own.",
                type: SlashCommandOptions.SUB_COMMAND,
                options: [
                    {
                        name: "tag",
                        description: "The name of the tag to edit.",
                        type: SlashCommandOptions.STRING,
                        required: true
                    }
                ]
            },
            {
                name: "search",
                description: "Search for a tag by name.",
                type: SlashCommandOptions.SUB_COMMAND,
                options: [
                    {
                        name: "tag",
                        description: "The name of the tag to search for.",
                        type: SlashCommandOptions.STRING,
                        required: true
                    }
                ]
            },
            {
                name: "get",
                description: "Get a tag by name.",
                type: SlashCommandOptions.SUB_COMMAND,
                options: [
                    {
                        name: "tag",
                        description: "The name of the tag to find.",
                        type: SlashCommandOptions.STRING,
                        required: true
                    }
                ]
            },
            {
                name: "delete",
                description: "Delete a tag that you own.",
                type: SlashCommandOptions.SUB_COMMAND,
                options: [
                    {
                        name: "tag",
                        description: "The name of the tag to delete.",
                        type: SlashCommandOptions.STRING,
                        required: true
                    }
                ]
            }
        ]
    };
}