import {ICommand} from "../structs/ICommand";
import * as Discord from "discord.js";
import {Interaction, MessageEmbed} from "discord.js";
import {SlashCommandOptions} from "../structs/ICommandOptions";

export default class UserInfoCommand implements ICommand {

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

    public async execute(interaction: Interaction): Promise<void> {
        if (!interaction.isCommand()) return;
        if (interaction.commandName == this.name) {
            const user = await interaction.options.getUser("user");
            const target = interaction.guild.members.cache.get(user.id);
            const embed = new MessageEmbed()
                .setAuthor(target.user.tag, target.displayAvatarURL({dynamic: true, size: 512}))
                .setColor("#00e1ff")
                .setThumbnail(target.user.displayAvatarURL({dynamic: true, size: 512}))
                .addFields([
                    {
                        name: "User ID",
                        value: target.id,
                        inline: false
                    },
                    {
                        name: "Timestamps",
                        value: `Joined guild: <t:${parseInt(String(target.joinedTimestamp / 1000))}:R>` + "\n" + `Account created: <t:${parseInt(String(target.user.createdTimestamp / 1000))}:R>`,
                        inline: false
                    },
                    {
                        name: "Roles",
                        value: target.roles.cache.map(role => role).join(" ").replace("@everyone", "") || "None.",
                        inline: false
                    }
                ])
                .setFooter("RoboEerie", this.client.user.displayAvatarURL({dynamic: true}))
                .setTimestamp();
            return await interaction.reply({embeds: [embed], ephemeral: true});
        }
    }

    public slashData: object = {
        name: this.name,
        description: this.description,
        options: [
            {
                name: "user",
                description: "The user to view.",
                type: SlashCommandOptions.USER,
                required: true
            }
        ]
    }
}