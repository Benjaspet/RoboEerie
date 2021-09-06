import * as Discord from "discord.js";
import {Client} from "discord.js";

export default class AvatarCommand {

    public name: string = <string> "avatar";
    public once: boolean = <boolean> false;
    public enabled = <boolean> true;
    public description: string = <string> "Display the avatar of the specified user.";

    constructor(client: Client) {
        this.enabled = true;
    }

    public async execute(interaction, client: Client) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            const member = interaction.options.getMember("user");
            const embed = new Discord.MessageEmbed()
                .setTitle(`${member.user.tag}'s Avatar`)
                .setImage(member.user.displayAvatarURL({dynamic: true, size: 512}))
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
                type: "USER",
                required: true
            }
        ]
    };
}