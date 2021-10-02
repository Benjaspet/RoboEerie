import * as Discord from "discord.js";
import config from "../resources/Config";
import {Message} from "discord.js";

export default class PonjoUtil {

    public static sendServerWelcomeMessage(member) {
        const welcomeChannel = member.guild.channels.cache.get(config.ponjo_development.welcomeChannel);
        const output = `Welcome to the Ponjo Development Support server, <@${member.id}>!`;
        return welcomeChannel.send({content: output});
    }

    public static trimString(input: string): string {
        return input.length > 1024 ? `${input.slice(0, 1020)} ... ` : input;
    }

    public static capitalize(string: string): string {
        let str = string.split(" ");
        for (let i = 0; i < str.length; i++) {
            const firstChar = str[i].charAt(0)
            str[i] = firstChar.toUpperCase() + str[i].substr(1)
        }
        return str.join(" ");
    }

    public static getErrorMessageEmbed(client, content): Discord.MessageEmbed {
        return new Discord.MessageEmbed()
            .setColor("RED")
            .setDescription(`${config.emojis.error} ${content}`)
    }

    public static sleep(ms): Promise<any> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}