import {ICommand} from "../structs/ICommand";
import * as Discord from "discord.js";
import emojis from "../resources/Emojis";

export default class ServerInfoCommand implements ICommand {

    public name: string = "serverinfo";
    public once: boolean = false;
    public enabled: boolean = true;
    public description: string = "View information about the server.";
    public aliases: string[] = [];
    protected client: Discord.Client;

    constructor(client: Discord.Client) {
        this.client = client;
        this.enabled = true;
    }

    public async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            const {guild} = interaction;
            const guildId = guild.id;
            const guildName = guild.name;
            const guildIcon = guild.iconURL();
            const guildOwnerId = guild.ownerId;
            const guildOwner = this.client.users.cache.get(guildOwnerId).tag;
            const textChannels = guild.channels.cache.filter(c => c.type === "GUILD_TEXT").size;
            const voiceChannels = guild.channels.cache.filter(c => c.type === "GUILD_VOICE").size;
            const memberCount = guild.memberCount;
            const roleCount = guild.roles.cache.size;
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
            const animatedIcon = guild.features.includes("ANIMATED_ICON") ? `${emojis.success} Animated Icon` : `${emojis.error} Animated Icon`;
            const banner = guild.features.includes("BANNER") ? `${emojis.success} Banner` : `${emojis.error} Banner`;
            const community = guild.features.includes("COMMUNITY") ? `${emojis.success} Community Server` : `${emojis.error} Community Server`;
            const inviteSplash = guild.features.includes("INVITE_SPLASH") ? `${emojis.success} Invite Splash` : `${emojis.error} Invite Splash`;
            const partnered = guild.features.includes("PARTNERED") ? `${emojis.success} Partnered` : `${emojis.error} Partnered`;
            const vanity = guild.features.includes("VANITY_URL") ? `${emojis.success} Vanity URL (${guild.vanityURLCode}, ${guild.vanityURLUses} uses)` : ` ${emojis.error} Vanity URL`;
            const news = guild.features.includes("NEWS") ? `${emojis.success} News Channels` : `${emojis.error} News Channels`;
            const verified = guild.features.includes("VERIFIED") ? `${emojis.success} Verified` : `${emojis.error} Verified`;
            const welcomeScreen = guild.features.includes("WELCOME_SCREEN_ENABLED") ? `${emojis.success} Welcome Screen` : `${emojis.error} Welcome Screen`;
            const featureString = `${animatedIcon}\n${banner}\n${community}\n${inviteSplash}\n${partnered}\n${vanity}\n${news}\n${verified}\n${welcomeScreen}`;
            const embed = new Discord.MessageEmbed()
                .setTitle(guildName)
                .setColor("#00e1ff")
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
                .setFooter(`RoboEerie | ${guildName}`, this.client.user.displayAvatarURL({dynamic: true}))
            return await interaction.reply({embeds: [embed]});
        }
    }

    public slashData: object = <object> {
        name: this.name,
        description: this.description,
    };

}