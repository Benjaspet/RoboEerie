import {PonjoCommand} from "../interfaces/PonjoCommand";
import * as Discord from "discord.js";
import config from "../resources/Config";

export default class ServerInfoCommand implements PonjoCommand {

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
            const guildIcon = guild.iconURL;
            const guildOwner = guild.owner;
            const guildOwnerId = guild.owner_id;
            const guildDescription = guild.description ?? "None.";
            const textChannels = guild.channels.filter(c => c.type === "text").size;
            const voiceChannels = guild.channels.filter(c => c.type === "voice").size;
            const memberCount = guild.members.size;
            const roleCount = guild.roles.size;
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
            const features = {
                animatedIcon: guild.features.ANIMATED_ICON ? `${config.emojis.success} Animated Icon` : `${config.emojis.error} Animated Icon`,
                banner: guild.features.BANNER ? `${config.emojis.success} Banner` : `${config.emojis.error} Banner`,
                community: guild.features.COMMUNITY ? `${config.emojis.success} Community Server` : `${config.emojis.error} Community Server`,
                inviteSplash: guild.features.INVITE_SPLASH ? `${config.emojis.success} Invite Splash` : `${config.emojis.error} Invite Splash`,
                partnered: guild.features.PARTNERED ? `${config.emojis.success} Partnered` : `${config.emojis.error} Partnered`,
                vanityUrl: guild.features.VANITY_URL ? `${config.emojis.error} Vanity URL (${guild.vanityURLCode}, ${guild.vanityURLUses} uses)` : ` ${config.emojis.success} Vanity URL`,
                newsChannels: guild.features.NEWS,
                verified: guild.features.VERIFIED,
                welcomeScreen: guild.features.WELCOME_SCREEN_ENABLED
            }
            const embed = new Discord.MessageEmbed()
                .setTitle(guildName)
                .setThumbnail(guildIcon)
                .setDescription(`
                **ID:** ${guildId}
                **Owner:** ${guildOwner}`)
                .addFields([
                    {
                        name: "Features",
                        value: features.animatedIcon
                    }
                ])
        }
    }

    public slashData: object = <object> {
        name: this.name,
        description: this.description,
    };

}