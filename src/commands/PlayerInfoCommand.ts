import * as Discord from "discord.js";
import {getNameHistoryByName, getSkinDataByName, getUUID} from "mojang-minecraft-api";
import PonjoUtil from "../utils/PonjoUtil";
import {Client} from "discord.js";
import {PonjoCommand} from "../interfaces/PonjoCommand";
import {SlashCommandOptions} from "../interfaces/CommandOptions";

export default class PlayerInfoCommand implements PonjoCommand {

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
            switch (query) {
                case "name-history":
                    await getNameHistoryByName(player)
                        .then(data => {
                            const names = data.map(e => e.name).join(", ");
                            const embed = new Discord.MessageEmbed()
                                .setTitle(player + "'s Usernames")
                                .setColor("#00e1ff")
                                .setDescription(names)
                                .setFooter("Ponjo", this.client.user.displayAvatarURL({dynamic: true}))
                                .setTimestamp()
                            return interaction.reply({embeds: [embed]});
                        }).catch(error => {
                            console.error(error);
                            return interaction.reply({embeds: [PonjoUtil.getErrorMessageEmbed(this.client, "Previous usernames could not be found.")]});
                        });
                    break;
                case "skin":
                    await getSkinDataByName(player)
                        .then(data => {
                            const url = data.textures.SKIN.url;
                            const timestamp = Math.round((new Date()).getTime() / 1000);
                            const embed = new Discord.MessageEmbed()
                                .setAuthor(player + "'s Skin", "https://mc-heads.net/head/" + player)
                                .setThumbnail("https://mc-heads.net/body/" + player)
                                .setColor("#00e1ff")
                                .setDescription(`You are viewing the skin of ${player} currently. If you'd like to download this skin for yourself, you can do so by [clicking here](${url}).` + `\n\n` + `API request sent: <t:${timestamp}>`)
                                .setFooter("Ponjo", this.client.user.displayAvatarURL({dynamic: true}))
                                .setTimestamp()
                            return interaction.reply({embeds: [embed]});
                        }).catch(error => {
                            console.error(error);
                            return interaction.reply({embeds: [PonjoUtil.getErrorMessageEmbed(this.client, "Skin not found for that player.")]});
                        });
                    break;
                case "head":
                    const embed = new Discord.MessageEmbed()
                        .setTitle(player + "'s Head")
                        .setImage("https://mc-heads.net/head/" + player)
                        .setColor("#00e1ff")
                        .setFooter("Ponjo", this.client.user.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                    return interaction.reply({embeds: [embed]});
                case "uuid":
                    await getUUID(player)
                        .then(data => {
                            const embed = new Discord.MessageEmbed()
                                .setAuthor(data.name + "'s UUID", "https://mc-heads.net/head/" + player)
                                .setColor("#00e1ff")
                                .setDescription("UUID: `" + data.id + "`")
                                .setFooter("Ponjo", this.client.user.displayAvatarURL({dynamic: true}))
                                .setTimestamp()
                            return interaction.reply({embeds: [embed]})
                        }).catch(error => {
                            console.error(error);
                            return interaction.reply({embeds: [PonjoUtil.getErrorMessageEmbed(this.client, "Invalid username. Please try again.")]});
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
                    }
                ]
            }
        ]
    };

}