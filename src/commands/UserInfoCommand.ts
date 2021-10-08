import {PonjoCommand} from "../interfaces/PonjoCommand";
import * as Discord from "discord.js";

export default class UserInfoCommand implements PonjoCommand {

    public name: string = "userinfo";
    public once: boolean = false;
    public enabled: boolean = true;
    public description: string = "View information about a specific user.";
    public aliases: string[] = [];
    public client: Discord.Client;

    constructor(client) {
        this.enabled = true;
        this.client = client;
    }

    public async execute(interaction): Promise<boolean> {
        if (!interaction.isCommand()) return;
        if (interaction.commandName == this.name) {
            return true;
        }
    }

    public slashData: object = {
        name: this.name,
        description: this.description,
        options: [
            {
                name: "user",
                description: "The user to view.",
                type: "USER",
                required: true
            }
        ]
    }
}