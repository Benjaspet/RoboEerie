import AvatarCommand from "../commands/AvatarCommand";
import BanCommand from "../commands/BanCommand";
import DeployCommand from "../commands/DeployCommand";
import config from "../resources/Config";
import DocsCommand from "../commands/DocsCommand";
import GitHubCommand from "../commands/GitHubCommand";
import KickCommand from "../commands/KickCommand";
import MemeCommand from "../commands/MemeCommand";
import NPMCommand from "../commands/NPMCommand";
import PingCommand from "../commands/PingCommand";
import PlayerInfoCommand from "../commands/PlayerInfoCommand";
import PokemonCommand from "../commands/PokemonCommand";
import PollCommand from "../commands/PollCommand";
import QueryCommand from "../commands/QueryCommand";
import SendCommand from "../commands/SendCommand";
import StatsCommand from "../commands/StatsCommand";
import UrbanCommand from "../commands/UrbanCommand";

export default class SlashCommandUtil {

    public static async deployAllSlashCommands(client, guild: boolean = true) {
        const slashCommandData = [
            new AvatarCommand(client).slashData,
            new BanCommand(client).slashData,
            new DeployCommand(client).slashData,
            new DocsCommand(client).slashData,
            new GitHubCommand(client).slashData,
            new KickCommand(client).slashData,
            new MemeCommand(client).slashData,
            new NPMCommand(client).slashData,
            new PingCommand(client).slashData,
            new PlayerInfoCommand(client).slashData,
            new PokemonCommand(client).slashData,
            new PollCommand(client).slashData,
            new QueryCommand(client).slashData,
            new SendCommand(client).slashData,
            new StatsCommand(client).slashData,
            new UrbanCommand(client).slashData
        ];
        if (guild) {
            client.guilds.cache.get(config.developer.ponjoGuild)?.commands.set(slashCommandData);
        }
        if (!guild) {
            client.application?.commands.set(slashCommandData);
        }
    }

    public static async deleteAllSlashCommands(client, guild: boolean = true) {
        if (guild) {
            try {
                client.guilds.cache.get(config.developer.ponjoGuild)?.commands.set([]);
            } catch (error) {
                new Error(error.message);
            }
        } else {
            try {
                client.application?.commands.set([]);
            } catch (error) {
                new Error(error.message);
            }
        }
    }
}