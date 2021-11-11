import {Client, Interaction} from "discord.js";
import AvatarCommand from "../commands/AvatarCommand";
import BanCommand from "../commands/BanCommand";
import BannerCommand from "../commands/BannerCommand";
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
import TagCommand from "../commands/TagCommand";
import ServerInfoCommand from "../commands/ServerInfoCommand";

export default class CommandBuilder {

    public static async respondToApplicationCommands(client: Client, interaction: Interaction) {
        new AvatarCommand(client).execute(interaction).then(() => {});
        new BanCommand(client).execute(interaction).then(() => {});
        new BannerCommand(client).execute(interaction).then(() => {});
        new DocsCommand(client).execute(interaction).then(() => {});
        new GitHubCommand(client).execute(interaction).then(() => {});
        new KickCommand(client).execute(interaction).then(() => {});
        new MemeCommand(client).execute(interaction).then(() => {});
        new NPMCommand(client).execute(interaction).then(() => {});
        new PingCommand(client).execute(interaction).then(() => {});
        new PlayerInfoCommand(client).execute(interaction).then(() => {});
        new PokemonCommand(client).execute(interaction).then(() => {});
        new PollCommand(client).execute(interaction).then(() => {});
        new QueryCommand(client).execute(interaction).then(() => {});
        new SendCommand(client).execute(interaction).then(() => {});
        new ServerInfoCommand(client).execute(interaction).then(() => {});
        new StatsCommand(client).execute(interaction, client).then(() => {});
        new TagCommand(client).execute(interaction).then(() => {});
        new UrbanCommand(client).execute(interaction).then(() => {});
    }

}