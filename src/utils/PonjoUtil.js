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

    static trimString(input) {
        return input.length > 1024 ? `${input.slice(0, 1020)} ... ` : input;
    }

    static getErrorMessageEmbed(client, content) {

        return new Discord.MessageEmbed()
            .setColor("RED")
            .setDescription(`${config.emojis.error} ${content}`)

    }

    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}