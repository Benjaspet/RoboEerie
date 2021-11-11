import * as Discord from "discord.js";
import AppBuilder from "./builders/AppBuilder";
import EventBase from "./base/BaseEvent";
import IntentUtil from "./utils/ws/IntentUtil";

const client = new Discord.Client({
    allowedMentions: {
        parse: IntentUtil.getParsedMentions(),
        repliedUser: false,
    },
    partials: IntentUtil.getPartials(),
    intents: IntentUtil.getIntents(),
});

new AppBuilder(client).login();
new EventBase(client);