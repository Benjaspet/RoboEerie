import * as Discord from "discord.js";
import {Client} from "discord.js";
import {v4 as uuidv4} from "uuid";
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
                case "tag-create":
                    const content = interaction.options.getString("content");
                    if (interaction.user.id != process.env.OWNER) {
                        return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client, "error", "Only the bot developer can create tags.")]});
                    }
                    const exists = await TagUtil.tagExists(tag);
                    if (exists) {
                        return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client, "error", "A tag by that name already exists.")]});
                    }
                    await TagUtil.createTag(uuidv4(), tag, content, interaction.user.id, interaction.guild.id)
                        .then(async () => {
                            const embed = new Discord.MessageEmbed()
                                .setDescription(`Successfully created the \`${tag}\` tag.`)
                                .setColor("#00e1ff")
                            return await interaction.reply({embeds: [embed]});
                        })
                        .catch(async error => {
                            return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client, "error", error.msg)]});
                        });
                    break;
                case "tag-search":
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
                        .catch(async error => {
                            return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client, "error", "Could not find that tag.")]});
                        });
                    break;
                case "tag-find":
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
                                .catch(async error => {
                                    return await interaction.reply({embeds: [EmbedUtil.fetchEmbedByType(this.client, "error", "Could not find that tag.")]});
                                });
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
                        name: "Create a Tag",
                        value: "tag-create"
                    },
                    {
                        name: "Search for a Tag",
                        value: "tag-search"
                    },
                    {
                        name: "Find a Tag",
                        value: "tag-find"
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