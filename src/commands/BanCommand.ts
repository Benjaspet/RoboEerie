import PonjoUtil from "../utils/PonjoUtil";
import * as Discord from "discord.js";
import {Client} from "discord.js";

export default class BanCommand {

    public name: string = <string> "ban";
    public once: boolean = <boolean> false;
    public enabled: boolean = <boolean> true;
    public description: string = <string> "Ban a user from the server.";

    constructor(client: Client) {
        this.enabled = true;
    }

    public async execute(interaction, client: Client) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            const permissions = interaction.member.permissions;
            const user = interaction.options.getUser("member");
            const reason = interaction.options.getString("reason") || undefined;
            if (!permissions.has("ADMINISTRATOR") || !permissions.has("BAN_MEMBERS")) {
                return await interaction.reply({embeds: [PonjoUtil.getErrorMessageEmbed(client, "You don't have the correct permissions.")]});
            }
            const member = interaction.guild.members.cache.get(user.id);
            if (!member.bannable) return interaction.reply({embeds: [PonjoUtil.getErrorMessageEmbed(client, "I cannot kick that member.")]});
            if (!reason) {
                const embed = new Discord.MessageEmbed()
                    .setTitle("Uh-oh!")
                    .setColor("#00e1ff")
                    .setDescription("You were banned from " + interaction.member.guild.name + "." + "\n" + "Reason: none provided.")
                    .setFooter("Ponjo Team", client.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                try {
                    await client.users.cache.get(user.id).send({embeds: [embed]});
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
                    .setFooter("Ponjo Team", client.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                try {
                    await client.users.cache.get(user.id).send({embeds: [embed]});
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
        description: this.name,
        options: [
            {
                name: "member",
                description: "The guild member to ban.",
                type: "USER",
                required: true
            },
            {
                name: "reason",
                description: "The reason for banning the user.",
                type: "STRING",
                required: false
            }
        ]
    };

}