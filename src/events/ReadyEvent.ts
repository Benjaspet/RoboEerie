import {IEvent} from "../interfaces/IEvent";
import {Client, ClientEvents, Presence} from "discord.js";
import PonjoUtil from "../utils/PonjoUtil";
import DatabaseUtil from "../utils/database/DatabaseUtil";
import BaseConfig from "../base/BaseConfig";
import BaseLogger from "../base/BaseLogger";

export default class ReadyEvent implements IEvent {

    public name: keyof ClientEvents;
    public once: boolean;
    public client: Client;

    constructor(client: Client, name: keyof ClientEvents, once: boolean) {
        this.name = name;
        this.once = once;
        this.client = client;
    }

    public async execute(): Promise<void> {
        PonjoUtil.clearConsole();
        this.handlePresence();
        await DatabaseUtil.connectToDatabase();
        BaseLogger.info(`Logged in as ${this.client.user.tag}.`);
    }

    private handlePresence(): void {
        this.updatePresence()
            .then(() => setInterval(() => this.updatePresence(), 500 * 1000))
            .catch(() => this.handlePresence())
        return undefined;
    }

    private async updatePresence(): Promise<Presence | undefined> {
        const activity = BaseConfig.get("ACTIVITY");
        return this.client.user.setActivity({type: "WATCHING", name: activity});
    }
}