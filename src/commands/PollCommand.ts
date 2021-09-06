import config from "../resources/Config";
import * as Discord from "discord.js";
import {Client} from "discord.js";
import {PonjoCommand} from "../interfaces/PonjoCommand";

export default class PollCommand implements PonjoCommand {

    public name: string = "poll";
    public once: boolean = false;
    public enabled: boolean = true;
    public description: string = "Create a poll for the guild.";
    public aliases: string[] = [];
    protected client: Discord.Client;

    constructor(client: Client) {
        this.enabled = true;
        this.client = client;
    }

    public async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            const content = interaction.options.getString("description");
            const channel = interaction.options.getChannel("channel");
            await interaction.reply({content: "The poll was successfully published."});
            const embed = new Discord.MessageEmbed()
                .setTitle("Server Poll")
                .setColor("#00e1ff")
                .setDescription(content)
                .setFooter(interaction.user.tag, this.client.user.displayAvatarURL({dynamic: true}))
                .setTimestamp()
            channel.send({embeds: [embed]})
                .then(async msg => {
                    await msg.react(config.emojis.success);
                    await msg.react(config.emojis.error);
                });
        }
    }

    public slashData: object = <object> {
        name: this.name,
        description: this.description,
        options: [
            {
                name: "channel",
                description: "The channel to send the poll in.",
                type: "CHANNEL",
                required: true,
            },
            {
                name: "description",
                description: "The context/description of the poll.",
                type: "STRING",
                required: true
            }
        ]
    };

}