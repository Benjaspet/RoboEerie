import * as Discord from "discord.js";
import {Client, MessageEmbed, Permissions} from "discord.js";
import {ICommand} from "../structs/ICommand";
import {SlashCommandOptions} from "../structs/ICommandOptions";
import emojis from "../resources/Emojis";
import Util from "../utils/Util";

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
            if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                return await interaction.reply({content: "You don't have the required permissions to do this.", ephemeral: true});
            }
            const component = interaction.options.getString("component");
            const channel = interaction.options.getChannel("channel");
            const content = interaction.options.getString("content");
            let embed;
            switch (component) {
                case "verification-message":
                    embed = new Discord.MessageEmbed()
                        .setTitle("Welcome to the Ponjo Hangout!")
                        .setColor("#00e1ff")
                        .setDescription("In order to join the server fully and gain access to all channels, please react to the message below. By reacting, you are agreeing to the server rules and to abide by Discord's Terms of Service. We hope you enjoy your stay!")
                        .setFooter("RoboEerie", this.client.user.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                    const row = new Discord.MessageActionRow()
                        .addComponents(
                            new Discord.MessageButton()
                                .setCustomId("verify")
                                .setLabel("Verify yourself!")
                                .setStyle("SECONDARY")
                                .setEmoji(emojis.success)
                        );
                    await interaction.reply({content: "The component has been sent successfully.", ephemeral: true});
                    return await channel.send({embeds: [embed], components: [row]});
                case "custom-message":
                    embed = new MessageEmbed()
                        .setColor("#00e1ff")
                        .setDescription(content)
                        .setFooter("RoboEerie", this.client.user.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                    await interaction.reply({content: "The component has been sent successfully.", ephemeral: true});
                    return await channel.send({embeds: [embed]});
                case "rules":
                    embed = new MessageEmbed()
                        .setTitle("Server Rules")
                        .setColor(Util.getDefaultEmbedColor())
                        .setDescription("1. **Be respectful.** Set boundaries yourself, and respect others boundaries. Offensive jokes are allowed, but set boundaries.\n" + "\n" +
                            "2. **Don’t spam.** Mass message spamming, spam-pinging, and spam text will result in a warning. If the behavior continues you will be muted. If you are unmuted and do this again, you will be kicked.\n" + "\n" +
                            "3. **Don’t post or send explicit content.** Do NOT post/send sexual images/videos, gore, or anything explicit in nature to any channel or to anyone on this server. Doing so will result in a kick or a temporary ban depending on severity and amount of images/videos sent. If ANYONE sends you explicit content, DM or ping one of the staff.\n" + "\n" +
                            "4. **Respect the decisions of the moderators.** Do not contest or defy a staff's decision. It is important to note that any staff member has the right to punish accordingly if deemed appropriate, and the reason does not particularly have to exist within these rules.\n" + "\n" +
                            "5. **Don’t leak or share any private information.** This includes but is not limited to code & personal information. Doing so will result in an immediate and irrevocable ban.\n" + "\n" +
                            "6. **Don’t participate in illegal or malicious activities.** Do not threaten to DDoS or DOX any member of the server.\n" + "\n" +
                            "7. **Do not violate Discord's Terms of Service.** You risk your own account by violating the [Discord TOS](https://discordapp.com/terms). We can’t do anything if you are terminated.\n" + "\n" +
                            "8. **Use bots in their corresponding channels.** Don’t use bots outside of their assigned channels.\n" + "\n" +
                            "9. **Don’t ping staff unless ABSOLUTELY necessary.** Randomly/spam pinging staff will result in a mute.\n" + "\n" +
                            "10. **Have fun!** Enjoy your time in the server, and learn something new.")
                        .setFooter("RoboEerie", this.client.user.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                    break;
            }
            await interaction.reply({content: "The component has been sent successfully.", ephemeral: true});
            await channel.send({embeds: [embed]})
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
                    },
                    {
                        name: "Rules",
                        value: "rules"
                    },
                    {
                        name: "Custom Message",
                        value: "custom-message"
                    }
                ]
            },
            {
                name: "channel",
                description: "The channel to send the component to.",
                type: SlashCommandOptions.CHANNEL,
                required: true
            },
            {
                name: "content",
                description: "The message content to send.",
                type: SlashCommandOptions.STRING,
                required: false
            }
        ]
    };

}