import * as Discord from "discord.js";
import {Client} from "discord.js";
import {ICommand} from "../structs/ICommand";
import {SlashCommandOptions} from "../structs/ICommandOptions";

export default class AvatarCommand implements ICommand {

    public name: string = "avatar";
    public once: boolean = false;
    public enabled: boolean = true;
    public description: string = "Display the avatar of the specified user.";
    public aliases: string[] = [];
    protected client: Discord.Client;

    constructor(client: Client) {
        this.enabled = true;
        this.client = client;
    }

    public async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            const member = interaction.options.getMember("user");
            const embed = new Discord.MessageEmbed()
                .setTitle(`${member.user.tag}'s Avatar`)
                .setImage(member.user.displayAvatarURL({dynamic: true, size: 512, format: "png"}))
                .setColor("#00e1ff")
            await interaction.reply({embeds: [embed]});
        }
    }

    public slashData: object = <object> {
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