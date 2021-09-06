import * as Discord from "discord.js";
import {Client} from "discord.js";
import config from "../resources/Config";
import SlashCommandUtil from "../utils/slash/SlashCommandUtil";

export default class DeployCommand {

    public name: string = <string> "deploy";
    public once: boolean = <boolean> false;
    public enabled = <boolean> true;
    public description: string = <string> "Set all slash commands to the Ponjo Development guild.";
    public slashData: object = <object> {
        name: this.name,
        description: this.description,
    }

    constructor(client: Client) {
        this.enabled = true;
    }

    public async execute(interaction, client: Client) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            if (interaction.user.id !== config.developer.owner) {
                return await interaction.reply({content: "You are not the developer of this bot."});
            }
            await SlashCommandUtil.deployAllSlashCommands(client, false);
            await interaction.reply({content: "Slash commands successfully deployed."});
        }
    }
}