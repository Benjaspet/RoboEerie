import * as Discord from "discord.js";
import {Client, GuildMember, Interaction, Permissions} from "discord.js";
import {ICommand} from "../structs/ICommand";
import {SlashCommandOptions} from "../structs/ICommandOptions";
import EmbedUtil from "../utils/EmbedUtil";
import Util from "../utils/Util";

export default class BanCommand implements ICommand {

    public name: string = "ban";
    public description: string = "Ban a user from the server.";
    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public async execute(interaction: Interaction): Promise<void> {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            const staff = <GuildMember> interaction.member;
            const staffPermissions = <Permissions> interaction.member.permissions;
            const userToBan = interaction.options.getUser("user");
            const memberToBan = interaction.guild.members.cache.get(userToBan.id);
            const reason = interaction.options.getString("reason") || undefined;
            const days = interaction.options.getInteger("days") || 7;
            if (!staffPermissions.has("ADMINISTRATOR") || !staffPermissions.has("BAN_MEMBERS")) {
                return await interaction.reply({embeds: [EmbedUtil.getErrorMessageEmbed("You don't have the correct permissions.")]});
            }
            if (!memberToBan.bannable) {
                return await interaction.reply({embeds: [EmbedUtil.getErrorMessageEmbed("I cannot kick that member.")]});
            }
            if (!reason) {
                const embed = new Discord.MessageEmbed()
                    .setTitle("Uh-oh!")
                    .setColor(Util.getDefaultEmbedColor())
                    .setDescription("You were banned from " + staff.guild.name + "." + "\n" + "Reason: none provided.")
                    .setFooter("RoboEerie", this.client.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                try {
                    await this.client.users.cache.get(memberToBan.id).send({embeds: [embed]});
                    const reply = userToBan.username + " just got bent by " + staff.user.username + "!" + "\n" + "Reason: **none specified.**";
                    await memberToBan.ban({days: days});
                    return await interaction.reply({content: reply});
                } catch (error) {
                    const reply = userToBan.username + " just got bent by " + staff.user.username + "!" + "\n" + "Reason: **none specified.**";
                    await memberToBan.ban({days: days});
                    return await interaction.reply({content: reply});
                }
            } else {
                const embed = new Discord.MessageEmbed()
                    .setTitle("Uh-oh!")
                    .setColor(Util.getDefaultEmbedColor())
                    .setDescription("You were banned from " + staff.guild.name + "." + "\n" + "Reason: **" + reason + "**")
                    .setFooter("RoboEerie", this.client.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                try {
                    await this.client.users.cache.get(userToBan.id).send({embeds: [embed]});
                    const reply = userToBan.username + " just got bent by " + interaction.user.username + "!" + "\n" + "Reason: **" + reason + "**";
                    await memberToBan.ban({days: days, reason: reason});
                    return await interaction.reply({content: reply});
                } catch (error) {
                    const reply = userToBan.username + " just got bent by " + staff.user.username + "!" + "\n" + "Reason: **" + reason + "**";
                    await memberToBan.ban({days: days, reason: reason});
                    return await interaction.reply({content: reply});
                }
            }
        }
    }

    public slashData: object = {
        name: this.name,
        description: this.description,
        options: [
            {
                name: "user",
                description: "The guild member to ban.",
                type: SlashCommandOptions.USER,
                required: true
            },
            {
                name: "reason",
                description: "The reason for banning the user.",
                type: SlashCommandOptions.STRING,
                required: false
            },
            {
                name: "days",
                description: "The amount of days to ban the user for.",
                type: SlashCommandOptions.INTEGER,
                required: false
            }
        ]
    };
}