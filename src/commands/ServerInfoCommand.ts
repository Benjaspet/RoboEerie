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

import {ApplicationCommandData, Client, CommandInteraction, MessageEmbed} from "discord.js";
import {ApplicationCommand} from "../types/ApplicationCommand";
import Command from "../structs/Command";
import MrCodeAndWatchConstants from "../constants/MrCodeAndWatchConstants";

export default class ServerInfoCommand extends Command implements ApplicationCommand{

    private readonly client: Client;

    constructor(client: Client) {
        super("serverinfo", {
            name: "serverinfo",
            description: "View information about the server.",
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        const {guild} = interaction; const guildId = guild.id;
        const guildName = guild.name; const guildIcon = guild.iconURL();
        const guildOwnerId = guild.ownerId;
        const guildOwner = `<@${guildOwnerId}>`;
        const textChannels = guild.channels.cache.filter(c => c.type === "GUILD_TEXT").size;
        const voiceChannels = guild.channels.cache.filter(c => c.type === "GUILD_VOICE").size;
        const memberCount = guild.memberCount; const roleCount = guild.roles.cache.size;
        const boostCount = guild.premiumSubscriptionCount;
        const guildLevel = () => {
            switch (guild.premiumTier) {
                case "NONE": return "Level 0";
                case "TIER_1": return "Level 1";
                case "TIER_2": return "Level 2";
                case "TIER_3": return "Level 3";
                default: return "Level 0";
            }
        }
        const success: string = MrCodeAndWatchConstants.EMOJI_SUCCESS; const error: string = MrCodeAndWatchConstants.EMOJI_ERROR;
        const animatedIcon = guild.features.includes("ANIMATED_ICON") ? `${success} Animated Icon` : `${error} Animated Icon`;
        const banner = guild.features.includes("BANNER") ? `${success} Banner` : `${error} Banner`;
        const community = guild.features.includes("COMMUNITY") ? `${success} Community Server` : `${error} Community Server`;
        const inviteSplash = guild.features.includes("INVITE_SPLASH") ? `${success} Invite Splash` : `${error} Invite Splash`;
        const partnered = guild.features.includes("PARTNERED") ? `${success} Partnered` : `${error} Partnered`;
        const vanity = guild.features.includes("VANITY_URL") ? `${success} Vanity URL (${guild.vanityURLCode}, ${guild.vanityURLUses} uses)` : ` ${error} Vanity URL`;
        const news = guild.features.includes("NEWS") ? `${success} News Channels` : `${error} News Channels`;
        const verified = guild.features.includes("VERIFIED") ? `${success} Verified` : `${error} Verified`;
        const welcomeScreen = guild.features.includes("WELCOME_SCREEN_ENABLED") ? `${success} Welcome Screen` : `${error} Welcome Screen`;
        const featureString = `${animatedIcon}\n${banner}\n${community}\n${inviteSplash}\n${partnered}\n${vanity}\n${news}\n${verified}\n${welcomeScreen}`;
        const embed = new MessageEmbed()
            .setTitle(guildName)
            .setColor(MrCodeAndWatchConstants.DEFAULT_EMBED_COLOR)
            .setThumbnail(guildIcon)
            .setDescription(`
                **ID:** ${guildId}
                **Owner:** ${guildOwner}
                **Owner ID:** ${guildOwnerId}`)
            .addFields([
                {
                    name: "Features",
                    value: featureString,
                    inline: false
                },
                {
                    name: "Guild Information",
                    value: `Text Channels: ${textChannels}\nVoice Channels: ${voiceChannels}\nMembers: ${memberCount}\nRoles: ${roleCount}\nBoosts: ${boostCount} (${guildLevel()})`
                }
            ])
            .setFooter({text: `Mr. Code & Watch | ${guildName}`, iconURL: this.client.user.displayAvatarURL({dynamic: true})});
        return void await interaction.reply({embeds: [embed]});
    }

    public getName(): string {
        return this.name;
    }

    public getCommandData(): ApplicationCommandData {
        return this.data;
    }
}