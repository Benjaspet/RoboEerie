import * as Discord from "discord.js";
import {Client} from "discord.js";
import config from "../resources/Config";
import SlashCommandUtil from "../utils/SlashCommandUtil";
import {PonjoCommand} from "../interfaces/PonjoCommand";
import {SlashCommandOptions} from "../interfaces/CommandOptions";

export default class DeployCommand implements PonjoCommand {

    public name: string = "deploy";
    public once: boolean = false;
    public enabled: boolean = true;
    public description: string = "Set all slash commands to the Ponjo Development guild.";
    public aliases: string[] = [];
    protected client: Discord.Client;

    constructor(client: Client) {
        this.enabled = true;
        this.client = client;
    }

    public async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            if (interaction.user.id !== config.developer.owner) {
                return await interaction.reply({content: "You are not the developer of this bot."});
            }
            const deleting = interaction.options.getBoolean("delete");
            if (deleting) {
                await SlashCommandUtil.deleteAllSlashCommands(this.client, true)
            }
            await SlashCommandUtil.deployAllSlashCommands(this.client, true);
            await interaction.reply({content: "Slash commands successfully deployed."});
        }
    }

    public slashData: object = <object> {
        name: this.name,
        description: this.description,
        options: [
            {
                name: "delete",
                description: "Delete all slash commands.",
                type: SlashCommandOptions.BOOLEAN,
                required: true
            }
        ]
    };

}