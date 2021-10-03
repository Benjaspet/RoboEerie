import * as Discord from "discord.js";
import config from "../resources/Config";

export default class EmbedUtil {

    public static fetchEmbedByType(client, type: string, input?: string) {
        switch (type) {
            case "default":
                return new Discord.MessageEmbed()
                    .setColor("PURPLE")
                    .setDescription(input)
            case "error":
                return new Discord.MessageEmbed()
                    .setDescription(config.emojis.error + " " + input)
                    .setColor("RED")
        }
    }
}