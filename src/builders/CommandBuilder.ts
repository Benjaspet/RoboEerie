import {Client} from "discord.js";
import PonjoBuilder from "./PonjoBuilder";

export default class CommandBuilder extends PonjoBuilder {

    public client: Client;

    constructor(client: Client) {
        super();
        this.client = client;
        this.registerAllCommands();
    }

    private registerAllCommands(): void {
        PonjoBuilder.initAllEvents(this.client);
        PonjoBuilder.initAllSlashCommands(this.client);
    }

}