import * as Discord from "discord.js";
import {Client} from "discord.js";
import {ICommand} from "../structs/ICommand";
import {SlashCommandOptions} from "../structs/ICommandOptions";
import emojis from "../resources/Emojis";

export default class SendCommand implements ICommand {

    public name: string = "send";
    public once: boolean = false;
    public enabled: boolean = true;
    public description: string = "Send a component to a channel.";
    public aliases: string[] = [];
    protected client: Discord.Client;

    constructor(client: Client) {
        this.enabled = true;
        this.client = client;
    }

    public async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            const component = interaction.options.getString("component");
            const channel = interaction.options.getChannel("channel");
            switch (component) {
                case "verification-message":
                    const embed = new Discord.MessageEmbed()
                        .setTitle("Welcome to the Ponjo Development server!")
                        .setColor("#00e1ff")
                        .setDescription("In order to join the server fully and gain access to all channels, please react to the message below. By reacting, you are agreeing to the server rules and to abide by Discord's Terms of Service. We hope you enjoy your stay!")
                        .setFooter("Ponjo Team", this.client.user.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                    const row = new Discord.MessageActionRow()
                        .addComponents(
                            new Discord.MessageButton()
                                .setCustomId("verify")
                                .setLabel("Verify yourself!")
                                .setStyle("SECONDARY")
                                .setEmoji(emojis.success)
                        );
                    await interaction.reply({content: "The component has been sent successfully."});
                    await channel.send({embeds: [embed], components: [row]});
                    break;
            }
        }
    }

    public slashData: object = <object> {
        name: this.name,
        description: this.description,
        options: [
            {
                name: "component",
                description: "The component to send.",
                type: SlashCommandOptions.STRING,
                required: true,
                choices: [
                    {
                        name: "Verification Message",
                        value: "verification-message"
                    }
                ]
            },
            {
                name: "channel",
                description: "The channel to send the component to.",
                type: SlashCommandOptions.CHANNEL,
                required: true
            }
        ]
    };

}