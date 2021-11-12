import {IEvent} from "../../structs/IEvent";
import {Client, ClientEvents, Presence} from "discord.js";
import DatabaseUtil from "../../utils/database/DatabaseUtil";
import BaseConfig from "../../base/BaseConfig";
import BaseLogger from "../../base/BaseLogger";
import BaseSlashCommand from "../../base/BaseSlashCommand";
import SlashCommandUtil from "../../utils/ws/SlashCommandUtil";
import Util from "../../utils/Util";

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
        Util.clearConsole();
        this.handlePresence();
        await DatabaseUtil.connectToDatabase();
        BaseLogger.info(`Logged in as ${this.client.user.tag}.`);
        await this.handleApplicationCommands();

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

    private async handleApplicationCommands() {
        if (JSON.parse(BaseConfig.get("DEPLOY-APPLICATION-COMMANDS-GUILD")) == true) {
            await new BaseSlashCommand(this.client, SlashCommandUtil.getAllSlashCommandData(this.client), {
                deploy: true,
                delete: false,
                guild: true
            });
        } else if (JSON.parse(BaseConfig.get("DEPLOY-APPLICATION-COMMANDS-GLOBAL")) == true) {
            await new BaseSlashCommand(this.client, SlashCommandUtil.getAllSlashCommandData(this.client), {
                deploy: true,
                delete: false,
                guild: false
            });
        } else if (JSON.parse(BaseConfig.get("DELETE-APPLICATION-COMMANDS-GUILD")) == true) {
            await new BaseSlashCommand(this.client, SlashCommandUtil.getAllSlashCommandData(this.client), {
                deploy: false,
                delete: true,
                guild: true
            });
        } else if (JSON.parse(BaseConfig.get("DELETE-APPLICATION-COMMANDS-GLOBAL")) == true) {
            await new BaseSlashCommand(this.client, SlashCommandUtil.getAllSlashCommandData(this.client), {
                deploy: false,
                delete: true,
                guild: false
            });
        } else {
            BaseLogger.info("Application commands loaded.");
        }
    }
}