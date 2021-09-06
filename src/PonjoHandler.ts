import * as fs from "fs";
import {Client, Interaction} from "discord.js";
import AvatarCommand from "./interactions/AvatarCommand";
import BanCommand from "./interactions/BanCommand";
import ReadyEvent from "./events/ReadyEvent";

export default class PonjoHandler {

    public static initAllEvents(client: Client) {
        const eventFiles = fs.readdirSync(__dirname + "/events").filter(file => file.endsWith('.ts'));
        for (const file of eventFiles) {
            const event = require(__dirname + `/events/${file}`);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
    }

    public static initAllSlashCommands(client: Client) {
        client.on("interactionCreate", (...args) => {
            new AvatarCommand(client).execute(...args, client).then(() => {});
            new BanCommand(client).execute(...args, client).then(() => {});
        });
    }

}