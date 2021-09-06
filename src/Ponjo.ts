import * as Discord from "discord.js";
import CommandBuilder from "./builders/CommandBuilder";
import AppBuilder from "./builders/AppBuilder";
import IntentsBuilder from "./builders/IntentsBuilder";

const client = new Discord.Client({
    allowedMentions: {
        parse: ["users", "roles", "everyone"],
        repliedUser: false,
    },
    partials: ["CHANNEL", "MESSAGE", "REACTION"],
    intents: IntentsBuilder.getIntents(),
});

new CommandBuilder(client);
new AppBuilder(client);