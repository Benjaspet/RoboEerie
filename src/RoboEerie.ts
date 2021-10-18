import * as Discord from "discord.js";
import CommandBuilder from "./builders/CommandBuilder";
import AppBuilder from "./builders/AppBuilder";
import IntentsBuilder from "./builders/IntentsBuilder";

const client = new Discord.Client({
    allowedMentions: {
        parse: IntentsBuilder.getParsedMentions(),
        repliedUser: false,
    },
    partials: IntentsBuilder.getPartials(),
    intents: IntentsBuilder.getIntents(),
});

new CommandBuilder(client);
new AppBuilder(client);