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
import Utilities from "../utils/Utilities";
import Command from "../structs/Command";
import RoboEerieConstants from "../constants/RoboEerieConstants";

export default class BanCommand extends Command implements ApplicationCommand {

    private readonly client: Client;

    constructor(client: Client) {
        super("ban", {
            name: "ban",
            description:  "Ban a member from the server.",
            options: [
                {
                    name: "user",
                    description: "The guild member to ban.",
                    type: ApplicationCommandOptionTypes.USER,
                    required: true
                },
                {
                    name: "reason",
                    description: "The reason for banning the user.",
                    type: ApplicationCommandOptionTypes.STRING,
                    required: false
                },
                {
                    name: "days",
                    description: "The amount of days to ban the user for.",
                    type: ApplicationCommandOptionTypes.INTEGER,
                    required: false
                }
            ]
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        const staff = <GuildMember> interaction.member;
        const staffPermissions = <Permissions> interaction.member.permissions;
        const userToBan = interaction.options.getUser("user");
        const memberToBan = interaction.guild.members.cache.get(userToBan.id);
        const reason = interaction.options.getString("reason") || undefined;
        const days = interaction.options.getInteger("days") || 7;
        if (!staffPermissions.has("ADMINISTRATOR") || !staffPermissions.has("BAN_MEMBERS")) {
            return await interaction.reply({embeds: [EmbedUtil.getErrorEmbed("You don't have the correct permissions.")]});
        }
        if (!memberToBan.bannable) {
            return await interaction.reply({embeds: [EmbedUtil.getErrorEmbed("I cannot kick that member.")]});
        }
        if (!reason) {
            const embed = new MessageEmbed()
                .setTitle("Uh-oh!")
                .setColor(RoboEerieConstants.DEFAULT_EMBED_COLOR)
                .setDescription("You were banned from " + staff.guild.name + "." + "\n" + "Reason: none provided.")
                .setFooter({text: "RoboEerie", iconURL: this.client.user.displayAvatarURL({dynamic: true})})
                .setTimestamp()
            try {
                await this.client.users.cache.get(memberToBan.id).send({embeds: [embed]});
                const reply = userToBan.username + " just got bent by " + staff.user.username + "!" + "\n" + "Reason: **none specified.**";
                await memberToBan.ban({days: days});
                return await interaction.reply({content: reply});
            } catch (error) {
                const reply = userToBan.username + " just got bent by " + staff.user.username + "!" + "\n" + "Reason: **none specified.**";
                await memberToBan.ban({days: days});
                return await interaction.reply({content: reply});
            }
        } else {
            const embed = new MessageEmbed()
                .setTitle("Uh-oh!")
                .setColor(RoboEerieConstants.DEFAULT_EMBED_COLOR)
                .setDescription("You were banned from " + staff.guild.name + "." + "\n" + "Reason: **" + reason + "**")
                .setFooter({text: "RoboEerie", iconURL: this.client.user.displayAvatarURL({dynamic: true})})
                .setTimestamp()
            try {
                await this.client.users.cache.get(userToBan.id).send({embeds: [embed]});
                const reply = userToBan.username + " just got bent by " + interaction.user.username + "!" + "\n" + "Reason: **" + reason + "**";
                await memberToBan.ban({days: days, reason: reason});
                return await interaction.reply({content: reply});
            } catch (error) {
                const reply = userToBan.username + " just got bent by " + staff.user.username + "!" + "\n" + "Reason: **" + reason + "**";
                await memberToBan.ban({days: days, reason: reason});
                return await interaction.reply({content: reply});
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