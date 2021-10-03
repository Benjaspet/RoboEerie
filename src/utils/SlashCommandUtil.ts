import PonjoUtil from "./PonjoUtil";

const {REST} = require("@discordjs/rest");
const {Routes} = require("discord-api-types/v9");
import config from "../resources/Config";
import AvatarCommand from "../commands/AvatarCommand";
import BanCommand from "../commands/BanCommand";
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
import {Client} from "discord.js";
import BannerCommand from "../commands/BannerCommand";

export default class SlashCommandUtil {

    public static async setAllSlashCommands(client: Client, guild = true) {
        const rest = new REST({version: 9}).setToken(config.token);
        if (guild) {
            try {
                console.log("◒ Refreshing all guild slash commands...");
                await rest.put(Routes.applicationGuildCommands(config.clientId, config.guild), {
                    body: SlashCommandUtil.getAllSlashCommandData(client)});
                await PonjoUtil.sleep(1000);
                console.log("✔ Successfully updated all guild slash commands.");
            } catch (error) {
                console.error(error);
            }
        } else {
            if (!guild) {
                try {
                    console.log("◒ Refreshing all global slash commands...");
                    await rest.put(Routes.applicationCommands(config.clientId), {
                        body: SlashCommandUtil.getAllSlashCommandData(client)});
                    await PonjoUtil.sleep(1000);
                    console.log("✔ Successfully updated all global slash commands.");
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }

    public static async deleteAllSlashCommands(client: Client, guild: boolean = true) {
        const rest = new REST({version: 9}).setToken(config.token);
        if (guild) {
            try {
                console.log("◒ Deleting all guild slash commands...");
                await rest.put(Routes.applicationGuildCommands(config.clientId, config.guild), {
                    body: []});
                console.log("✔ Successfully deleted all guild slash commands.");
            } catch (error) {
                console.error(error);
            }
        } else {
            if (!guild) {
                try {
                    console.log("◒ Deleting all global slash commands...");
                    await rest.put(Routes.applicationCommands(config.clientId), {
                        body: []});
                    console.log("✔ Successfully deleted all global slash commands.");
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }

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
            new StatsCommand(client).slashData,
            new UrbanCommand(client).slashData
        ];
    }
}