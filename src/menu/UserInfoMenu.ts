import {Client, ContextMenuInteraction, MessageEmbed} from "discord.js";
import BaseLogger from "../base/BaseLogger";

export default class UserInfoMenu {

    public client: Client;
    public enabled: boolean;

    constructor(client: Client) {
        this.enabled = true;
        this.client = client;
    }

    public async execute(interaction: ContextMenuInteraction) {
        if (!interaction.isContextMenu()) return;
        if (interaction.commandName == "User Information") {
            try {
                const target = await interaction.guild.members.fetch(interaction.targetId);
                await target.user.fetch();
                const embed = new MessageEmbed()
                    .setAuthor(target.user.tag, target.user.avatarURL({dynamic: true, size: 512}))
                    .setColor("#00e1ff")
                    .setThumbnail(target.user.avatarURL({dynamic: true, size: 512}))
                    .addFields([
                        {
                            name: "User ID",
                            value: target.user.id,
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
            } catch (error) {
                BaseLogger.error(error);
            }
        }
    }

    public slashData: object = {
        name: "User Information",
        type: 2
    }
}