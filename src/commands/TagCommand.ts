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
            const action = interaction.options.getString("action");
            const tag = interaction.options.getString("tag");
            switch (action) {
                case "create":
                    const content = interaction.options.getString("content");
                    const exists = await TagUtil.tagExists(tag);
                    if (exists) {
                        return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client, "error", "A tag by that name already exists.")]});
                    }
                    await TagUtil.createTag(tag, content, interaction.user.id, interaction.guild.id)
                        .then(async () => {
                            return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client, "default", `Successfully created the \`${tag}\` tag.`)]});
                        })
                        .catch(async error => {
                            return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client, "error", error.msg)]});
                        });
                    break;
                case "search":
                    await TagUtil.findSimilarTags(tag)
                        .then(async result => {
                            const data = [];
                            result.map(obj => {
                                data.push(obj.tag);
                            });
                            const embed = new Discord.MessageEmbed();
                            embed.setTitle(`Search result for ${tag}:`);
                            embed.setColor("#00e1ff");
                            embed.setDescription("" + data.map(x => `• \`${x}\``).join("\n"));
                            return await interaction.reply({embeds: [embed]});
                        })
                        .catch(async () => {
                            return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client, "error", "Could not find that tag.")]});
                        });
                    break;
                case "find":
                    await TagUtil.searchGlobalTag(tag)
                        .then(async result => {
                            if (result) {
                                return await interaction.reply({content: result.content});
                            }
                        }).catch(async () => {
                            await TagUtil.findSimilarTags(tag)
                                .then(async result => {
                                    const data = [];
                                    result.map(obj => {
                                        data.push(obj.tag);
                                    });
                                    const embed = new Discord.MessageEmbed();
                                    embed.setTitle("Tag not found. Did you mean...");
                                    embed.setColor("#00e1ff");
                                    embed.setDescription("" + data.map(x => `• \`${x}\``).join("\n"));
                                    return await interaction.reply({embeds: [embed]});
                                })
                                .catch(async () => {
                                    return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client, "error", "Could not find that tag.")]});
                                });
                        });
                    break;
                case "edit":
                    const content2 = interaction.options.getString("content");
                    await TagUtil.searchGlobalTag(tag)
                        .then(async result => {
                            if (result.author === interaction.user.id) {
                                await TagUtil.editTag(tag, content2)
                                    .then(async () => {
                                        return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client, "default", `Edited the \`${result.tag}\` tag successfully.`)]});
                                    }).catch(async () => {
                                        return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client, "error", "That tag was not found.")]});
                                    });
                            } else {
                                return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client, "error", "You don't own that tag.")]});
                            }
                        }).catch(async error => {
                            console.log(error)
                            return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client, "error", "That tag was not found.")]});
                        });
                    break;
                case "delete":
                    await TagUtil.searchGlobalTag(tag)
                        .then(async result => {
                            if (result.author === interaction.user.id) {
                                await TagUtil.deleteTag(result.tag)
                                    .then(async () => {
                                        return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client, "default", `Deleted the \`${tag}\` tag successfully.`)]});
                                    }).catch(async () => {
                                        return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client, "error", "That tag was not found.")]});
                                    });
                            } else {
                                return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client, "error", "You don't own that tag.")]});
                            }
                        }).catch(async error => {
                            console.log(error)
                            return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client, "error", "That tag was not found.")]});
                        });
                    break;
            }
        }
    }

    public slashData: object = <object> {
        name: this.name,
        description: this.description,
        options: [
            {
                name: "action",
                description: "The sub-action within the tag command.",
                type: SlashCommandOptions.STRING,
                required: true,
                choices: [
                    {
                        name: "Create",
                        value: "create"
                    },
                    {
                        name: "Search",
                        value: "search"
                    },
                    {
                        name: "Find",
                        value: "find"
                    },
                    {
                        name: "Edit",
                        value: "edit"
                    },
                    {
                        name: "Delete",
                        value: "delete"
                    }
                ]
            },
            {
                name: "tag",
                description: "The tag to search for or modify.",
                type: SlashCommandOptions.STRING,
                required: true
            },
            {
                name: "content",
                description: "The tag content to create or modify.",
                type: SlashCommandOptions.STRING,
                required: false
            }
        ]
    };
}