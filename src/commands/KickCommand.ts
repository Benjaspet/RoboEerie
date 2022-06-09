/*
 * Copyright © 2022 Ben Petrillo. All rights reserved.
 *
 * Project licensed under the MIT License: https://www.mit.edu/~amini/LICENSE.md
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * All portions of this software are available for public use, provided that
 * credit is given to the original author(s).
 */

import {ApplicationCommandData, Client, CommandInteraction, GuildMember, MessageEmbed, Permissions} from "discord.js";
import {ApplicationCommand} from "../types/ApplicationCommand";
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import EmbedUtil from "../utils/EmbedUtil";
import Command from "../structs/Command";
import RoboEerieConstants from "../constants/RoboEerieConstants";

export default class KickCommand extends Command implements ApplicationCommand {

    private readonly client: Client;

    constructor(client: Client) {
        super("kick", {
           name: "kick",
           description: "Kick a member from the server.",
            options: [
                {
                    name: "member",
                    description: "The guild member to kick.",
                    type: ApplicationCommandOptionTypes.USER,
                    required: true
                },
                {
                    name: "reason",
                    description: "The reason for kicking the member.",
                    type: ApplicationCommandOptionTypes.STRING,
                    required: false
                }
            ]
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        const permissions: Readonly<Permissions> = interaction.member.permissions as Readonly<Permissions>;
        const user = interaction.options.getUser("member");
        const reason = interaction.options.getString("reason") || undefined;
        if (!permissions.has("ADMINISTRATOR") || !permissions.has("KICK_MEMBERS")) {
            return void await interaction.reply({embeds: [EmbedUtil.getErrorEmbed("You don't have the correct permissions.")]});
        }
        const member: GuildMember = interaction.guild.members.cache.get(user.id);
        if (!member.kickable) return interaction.reply({embeds: [EmbedUtil.getErrorEmbed("I cannot kick that member.")]});
        if (!reason) {
            const embed = new MessageEmbed()
                .setTitle("Uh-oh!")
                .setColor(RoboEerieConstants.DEFAULT_EMBED_COLOR)
                .setDescription("You were kicked from " + interaction.guild.name + "." + "\n" + "Reason: none provided.")
                .setFooter({text: "R. Eerie", iconURL: this.client.user.displayAvatarURL({dynamic: true})})
                .setTimestamp()
            try {
                await this.client.users.cache.get(user.id).send({embeds: [embed]});
                const reply = user.username + " just got bent by " + interaction.user.username + "!" + "\n" + "Reason: **none specified.**";
                await interaction.reply({content: reply});
                return void await member.kick("None provided.");
            } catch (error) {
                const reply = user.username + " just got bent by " + interaction.user.username + "!" + "\n" + "Reason: **none specified.**";
                await interaction.reply({content: reply});
                return void await member.kick("None provided.");
            }
        } else {
            const embed: MessageEmbed = new MessageEmbed()
                .setTitle("Uh-oh!")
                .setColor(RoboEerieConstants.DEFAULT_EMBED_COLOR)
                .setDescription("You were kicked from " + interaction.guild.name + "." + "\n" + "Reason: **" + reason + "**")
                .setFooter({text: "R. Eerie", iconURL: this.client.user.displayAvatarURL({dynamic: true})})
                .setTimestamp()
            try {
                await this.client.users.cache.get(user.id).send({embeds: [embed]});
                const reply: string = user.username + " just got bent by " + interaction.user.username + "!" + "\n" + "Reason: **" + reason + "**";
                await interaction.reply({content: reply});
                return void await member.kick(reason);
            } catch (error) {
                const reply: string = user.username + " just got bent by " + interaction.user.username + "!" + "\n" + "Reason: **" + reason + "**";
                await interaction.reply({content: reply});
                return void await member.kick(reason);
            }
        }
    }

    public getName(): string {
        return this.name;
    }

    public getCommandData(): ApplicationCommandData {
        return this.data;
    }
}