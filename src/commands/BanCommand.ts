import * as Discord from "discord.js";
import {Client} from "discord.js";
import {ICommand} from "../structs/ICommand";
import {SlashCommandOptions} from "../structs/ICommandOptions";
import Util from "../utils/Util";
import EmbedUtil from "../utils/EmbedUtil";

export default class BanCommand implements ICommand {

    public name: string = "ban";
    public once: boolean = false;
    public enabled: boolean = true;
    public description: string = "Ban a user from the server.";
    public aliases: [];
    protected client: Discord.Client;

    constructor(client: Client) {
        this.enabled = true;
        this.client = client;
    }

    public async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            const permissions = interaction.member.permissions;
            const user = interaction.options.getUser("member");
            const reason = interaction.options.getString("reason") || undefined;
            if (!permissions.has("ADMINISTRATOR") || !permissions.has("BAN_MEMBERS")) {
                return await interaction.reply({embeds: [EmbedUtil.getErrorMessageEmbed("You don't have the correct permissions.")]});
            }
            const member = interaction.guild.members.cache.get(user.id);
            if (!member.bannable) return interaction.reply({embeds: [EmbedUtil.getErrorMessageEmbed("I cannot kick that member.")]});
            if (!reason) {
                const embed = new Discord.MessageEmbed()
                    .setTitle("Uh-oh!")
                    .setColor("#00e1ff")
                    .setDescription("You were banned from " + interaction.member.guild.name + "." + "\n" + "Reason: none provided.")
                    .setFooter("Ponjo Team", this.client.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                try {
                    await this.client.users.cache.get(user.id).send({embeds: [embed]});
                    const reply = user.username + " just got bent by " + interaction.user.username + "!" + "\n" + "Reason: **none specified.**";
                    await interaction.reply({content: reply});
                    return await member.ban({days: 7});
                } catch (error) {
                    const reply = user.username + " just got bent by " + interaction.user.username + "!" + "\n" + "Reason: **none specified.**";
                    await interaction.reply({content: reply});
                    return await member.ban({days: 7});
                }
            } else {
                const embed = new Discord.MessageEmbed()
                    .setTitle("Uh-oh!")
                    .setColor("#00e1ff")
                    .setDescription("You were banned from " + interaction.member.guild.name + "." + "\n" + "Reason: **" + reason + "**")
                    .setFooter("Ponjo Team", this.client.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                try {
                    await this.client.users.cache.get(user.id).send({embeds: [embed]});
                    const reply = user.username + " just got bent by " + interaction.user.username + "!" + "\n" + "Reason: **" + reason + "**";
                    await interaction.reply({content: reply});
                    return await member.ban({days: 7, reason: reason});
                } catch (error) {
                    const reply = user.username + " just got bent by " + interaction.user.username + "!" + "\n" + "Reason: **" + reason + "**";
                    await interaction.reply({content: reply});
                    return await member.ban({days: 7, reason: reason});
                }
            }
        }
    }

    public slashData: object = <object> {
        name: this.name,
        description: this.description,
        options: [
            {
                name: "member",
                description: "The guild member to ban.",
                type: SlashCommandOptions.USER,
                required: true
            },
            {
                name: "reason",
                description: "The reason for banning the user.",
                type: SlashCommandOptions.STRING,
                required: false
            }
        ]
    };

}