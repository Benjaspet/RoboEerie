import * as Discord from "discord.js";
import emojis from "../resources/Emojis";
import BaseConfig from "../base/BaseConfig";
import Util from "./Util";
import {Client, GuildMember, TextChannel} from "discord.js";

export default class EmbedUtil {

    public static sendServerWelcomeMessage(member: GuildMember) {
        const welcomeChannel = member.guild.channels.cache.get(BaseConfig.get("WELCOME-CHANNEL"));
        const output = `Welcome to the Ponjo Development Support server, <@${member.id}>!`;
        if (welcomeChannel instanceof TextChannel) {
            return welcomeChannel.send({content: output});
        }
    }

    public static getErrorMessageEmbed(content: string) {
        return new Discord.MessageEmbed()
            .setDescription(`${emojis.error} ${content}`)
            .setColor("RED")
    }

    public static fetchEmbedByType(client, type: string, input?: string) {
        switch (type) {
            case "default":
                return new Discord.MessageEmbed()
                    .setColor(Util.getDefaultEmbedColor())
                    .setDescription(input)
            case "error":
                return new Discord.MessageEmbed()
                    .setDescription(`${emojis.error} ${input}`)
                    .setColor("RED")
        }
    }
}