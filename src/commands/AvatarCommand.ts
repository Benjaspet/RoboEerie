import {Client, Interaction, MessageEmbed} from "discord.js";
import {ICommand} from "../structs/ICommand";
import {SlashCommandOptions} from "../structs/ICommandOptions";
import Util from "../utils/Util";

export default class AvatarCommand implements ICommand {

    public name: string = "avatar";
    public description: string = "Display the avatar of the specified user.";
    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public async execute(interaction: Interaction): Promise<void> {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            const user = interaction.options.getUser("user");
            const embed = new MessageEmbed()
                .setTitle(`${user.tag}'s Avatar`)
                .setImage(user.displayAvatarURL({dynamic: true, size: 512, format: "png"}))
                .setColor(Util.getDefaultEmbedColor())
            return await interaction.reply({embeds: [embed]});
        }
    }

    public slashData: object = {
        name: this.name,
        description: this.description,
        options: [
            {
                name: "user",
                description: "The user whose avatar you'd like to view.",
                type: SlashCommandOptions.USER,
                required: true
            }
        ]
    };
}