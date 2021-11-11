import * as Discord from "discord.js";
import {getNameHistoryByName, getUUID} from "mojang-minecraft-api";
import PonjoUtil from "../utils/PonjoUtil";
import {Client} from "discord.js";
import {ICommand} from "../structs/ICommand";
import {SlashCommandOptions} from "../structs/ICommandOptions";

export default class PlayerInfoCommand implements ICommand {

    public name: string = "playerinfo";
    public once: boolean = false;
    public enabled: boolean = true;
    public description: string = "Get information about a Minecraft: Java Edition player.";
    public aliases: string[] = [];
    protected client: Discord.Client;

    constructor(client: Client) {
        this.enabled = true;
        this.client = client;
    }

    public async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            const player = interaction.options.getString("player");
            const query = interaction.options.getString("query");
            let uuid;
            await getUUID(player)
                .then(data => {
                    uuid = data.id;
                }).catch(error => {
                console.error(error);
                return interaction.reply({embeds: [PonjoUtil.getErrorMessageEmbed(this.client, "Invalid username. Please try again.")]});
            });
            switch (query) {
                case "name-history":
                    await getNameHistoryByName(player)
                        .then(data => {
                            const names = data.map(e => e.name).join(", ");
                            const embed = new Discord.MessageEmbed()
                                .setTitle(player + "'s Usernames")
                                .setColor("#00e1ff")
                                .setDescription(names)
                                .setFooter("RoboEerie", this.client.user.displayAvatarURL({dynamic: true}))
                                .setTimestamp()
                            return interaction.reply({embeds: [embed]});
                        }).catch(error => {
                            console.error(error);
                            return interaction.reply({embeds: [PonjoUtil.getErrorMessageEmbed(this.client, "Previous usernames could not be found.")]});
                        });
                    break;
                case "skin":
                    const timestamp = Math.round((new Date()).getTime() / 1000);
                    const embed2 = new Discord.MessageEmbed()
                        .setAuthor(player + "'s Skin", "https://crafatar.com/renders/head/" + uuid)
                        .setThumbnail("https://crafatar.com/renders/body/" + uuid)
                        .setColor("#00e1ff")
                        .setDescription(`You are viewing ${player}'s skin currently. This API request was sent: <t:${timestamp}>`)
                        .setFooter("RoboEerie", this.client.user.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                    await interaction.reply({embeds: [embed2]});
                    break;
                case "raw":
                    const embed3 = new Discord.MessageEmbed()
                        .setAuthor(player + "'s Skin", "https://crafatar.com/renders/head/" + uuid)
                        .setColor("#00e1ff")
                        .setImage("https://crafatar.com/skins/" + uuid)
                        .setFooter("RoboEerie", this.client.user.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                    await interaction.reply({embeds: [embed3]});
                    break;
                case "head":
                    const embed = new Discord.MessageEmbed()
                        .setTitle(player + "'s Head")
                        .setImage("https://crafatar.com/renders/head/" + uuid)
                        .setColor("#00e1ff")
                        .setFooter("RoboEerie", this.client.user.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                    return interaction.reply({embeds: [embed]});
                case "uuid":
                    const embed4 = new Discord.MessageEmbed()
                        .setAuthor(player + "'s UUID", "https://crafatar.com/renders/head/" + uuid)
                        .setColor("#00e1ff")
                        .setDescription("UUID: `" + uuid + "`")
                        .setFooter("RoboEerie", this.client.user.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                    await interaction.reply({embeds: [embed4]});
            }
        }
    }

    public slashData: object = <object> {
        name: this.name,
        description: this.description,
        options: [
            {
                name: "player",
                description: "The player to look up, by name.",
                type: SlashCommandOptions.STRING,
                required: true
            },
            {
                name: "query",
                description: "The type of information to return.",
                type: SlashCommandOptions.STRING,
                required: true,
                choices: [
                    {
                        name: "Name History",
                        value: "name-history"
                    },
                    {
                        name: "Skin Data",
                        value: "skin"
                    },
                    {
                        name: "Player Head",
                        value: "head"
                    },
                    {
                        name: "Get UUID",
                        value: "uuid"
                    },
                    {
                        name: "Raw Skin",
                        value: "raw"
                    }
                ]
            }
        ]
    };

}