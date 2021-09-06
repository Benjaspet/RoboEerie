import * as Discord from "discord.js";
import PonjoBuilder from "./PonjoBuilder";

export default class IntentsBuilder extends PonjoBuilder {

    public static getIntents() {
        return [
            Discord.Intents.FLAGS.GUILDS,
            Discord.Intents.FLAGS.GUILD_MEMBERS,
            Discord.Intents.FLAGS.GUILD_BANS,
            Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
            Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
            Discord.Intents.FLAGS.GUILD_WEBHOOKS,
            Discord.Intents.FLAGS.GUILD_INVITES,
            Discord.Intents.FLAGS.GUILD_MESSAGES,
            Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Discord.Intents.FLAGS.GUILD_VOICE_STATES,
            Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
            Discord.Intents.FLAGS.DIRECT_MESSAGES,
            Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
            Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        ];
    }

}