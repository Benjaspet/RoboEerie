import * as Discord from "discord.js";
import config from "../resources/Config";

export default class PonjoUtil {

    static sendServerWelcomeMessage(member) {

        const welcomeChannel = member.guild.channels.cache.get(config.ponjo_development.welcomeChannel);
        const output = `Welcome to the Ponjo Development Support server, <@${member.id}>!`;
        return welcomeChannel.send({content: output});

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