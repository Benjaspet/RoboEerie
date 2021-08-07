import fs from "fs";

export default class PonjoHandler {

    static initAllEvents(client) {

        const eventFiles = fs.readdirSync(__dirname + "/events").filter(file => file.endsWith('.js'));

        for (const file of eventFiles) {
            const event = require(__dirname + `/events/${file}`);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }

    }
}