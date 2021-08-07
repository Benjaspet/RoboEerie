import * as Discord from "discord.js";

export default class PonjoUtil {

    static createAnnouncement(client, title, content, color = "#00e1ff", channel) {

        const embed = new Discord.MessageEmbed()
            .setTitle(title)
            .setColor(color)
            .setDescription(content)
            .setFooter(client.user.username)
            .setTimestamp()

        return channel.send({embeds: [embed]});

    }
}