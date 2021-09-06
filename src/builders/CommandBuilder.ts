import * as fs from "fs";
import {Client} from "discord.js";
import PonjoHandler from "../PonjoHandler";

export default class CommandBuilder {

    public client;

    constructor(client: Client) {
        this.client = client;
        this.registerAllCommands();
    }

    private registerAllCommands(): void {
        PonjoHandler.initAllEvents(this.client);
        PonjoHandler.initAllSlashCommands(this.client);
    }
}