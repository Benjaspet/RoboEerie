import AvatarCommand from "../../commands/AvatarCommand";
import BanCommand from "../../commands/BanCommand";
import DocsCommand from "../../commands/DocsCommand";
import GitHubCommand from "../../commands/GitHubCommand";
import KickCommand from "../../commands/KickCommand";
import MemeCommand from "../../commands/MemeCommand";
import NPMCommand from "../../commands/NPMCommand";
import PingCommand from "../../commands/PingCommand";
import PlayerInfoCommand from "../../commands/PlayerInfoCommand";
import PokemonCommand from "../../commands/PokemonCommand";
import PollCommand from "../../commands/PollCommand";
import QueryCommand from "../../commands/QueryCommand";
import SendCommand from "../../commands/SendCommand";
import StatsCommand from "../../commands/StatsCommand";
import UrbanCommand from "../../commands/UrbanCommand";
import {Client} from "discord.js";
import BannerCommand from "../../commands/BannerCommand";
import TagCommand from "../../commands/TagCommand";
import ServerInfoCommand from "../../commands/ServerInfoCommand";
import UserInfoCommand from "../../commands/UserInfoCommand";
import UserInfoMenu from "../../menu/UserInfoMenu";

export default class SlashCommandUtil {

    public static getAllSlashCommandData(client: Client): object[] {
        return [
            new AvatarCommand(client).slashData,
            new BanCommand(client).slashData,
            new BannerCommand(client).slashData,
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
            new ServerInfoCommand(client).slashData,
            new StatsCommand(client).slashData,
            new TagCommand(client).slashData,
            new UrbanCommand(client).slashData,
            new UserInfoCommand(client).slashData,
            new UserInfoMenu(client).slashData
        ];
    }
}