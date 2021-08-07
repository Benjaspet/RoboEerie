import * as Discord from "discord.js";
import config from "../resources/config.json";

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

    static sendServerWelcomeMessage(member) {

        const welcomeChannel = member.guild.channels.cache.get(config.ponjo_development["welcome-channel"]);
        const output = `Welcome to the Ponjo Development Support server, <@${member.id}>!`;
        return welcomeChannel.send(output);

    }

    static getPonjoSnipeCollector() {

        return new Discord.Collection();

    }
}