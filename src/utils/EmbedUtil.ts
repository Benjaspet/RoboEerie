import * as Discord from "discord.js";
import emojis from "../resources/Emojis";

export default class EmbedUtil {

    public static fetchEmbedByType(client, type: string, input?: string) {
        switch (type) {
            case "default":
                return new Discord.MessageEmbed()
                    .setColor("#00e1ff")
                    .setDescription(input)
            case "error":
                return new Discord.MessageEmbed()
                    .setDescription(emojis.error + " " + input)
                    .setColor("RED")
        }
    }
}