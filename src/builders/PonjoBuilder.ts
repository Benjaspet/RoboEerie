import * as fs from "fs";
import {Client} from "discord.js";
import AvatarCommand from "../commands/AvatarCommand";
import BanCommand from "../commands/BanCommand";
import DeployCommand from "../commands/DeployCommand";
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

export default class PonjoBuilder {

    public static initAllEvents(client: Client) {
        const eventFiles = fs.readdirSync(__dirname + "/../events").filter(file => file.endsWith('.ts'));
        for (const file of eventFiles) {
            const event = require(__dirname + `/../events/${file}`);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
    }

    public static initAllSlashCommands(client: Client) {
        client.on("interactionCreate", (...args) => {
            new AvatarCommand(client).execute(...args).then(() => {});
            new BanCommand(client).execute(...args).then(() => {});
            new DeployCommand(client).execute(...args).then(() => {});
            new DocsCommand(client).execute(...args).then(() => {});
            new GitHubCommand(client).execute(...args).then(() => {});
            new KickCommand(client).execute(...args).then(() => {});
            new MemeCommand(client).execute(...args).then(() => {});
            new NPMCommand(client).execute(...args).then(() => {});
            new PingCommand(client).execute(...args).then(() => {});
            new PlayerInfoCommand(client).execute(...args).then(() => {});
            new PokemonCommand(client).execute(...args).then(() => {});
            new PollCommand(client).execute(...args).then(() => {});
            new QueryCommand(client).execute(...args).then(() => {});
            new SendCommand(client).execute(...args).then(() => {});
            new StatsCommand(client).execute(...args, client).then(() => {});
            new UrbanCommand(client).execute(...args).then(() => {});
        });
    }

}