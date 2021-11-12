import {Client} from "discord.js";
import {REST} from "@discordjs/rest";
import BaseConfig from "./BaseConfig";
import BaseLogger from "./BaseLogger";
import {Routes} from "discord-api-types/v9";
import SlashCommandUtil from "../utils/ws/SlashCommandUtil";
import Util from "../utils/Util";

export default class BaseSlashCommand {

    public client: Client;
    public slashData: object[];
    public action: any = {
        deploy: true,
        delete: false,
        guild: true
    };
    private clientId: string = BaseConfig.get("CLIENT-ID");
    private guildId: string = BaseConfig.get("GUILD-ID");

    constructor(client: Client, slashData: object[], action: any) {
        this.slashData = slashData;
        this.action = action;
        this.init().then(() => {});
    }

    private async init(): Promise<void> {
        const rest = new REST({version: "9"}).setToken(BaseConfig.get("TOKEN"));
        if (this.action.deploy) {
            if (this.action.guild) {
                try {
                    BaseLogger.info("Refreshing all guild slash commands..");
                    await rest.put(Routes.applicationGuildCommands(this.clientId, this.guildId), {
                        body: SlashCommandUtil.getAllSlashCommandData(this.client)});
                    await Util.sleep(1000);
                    BaseLogger.info("Successfully updated all guild slash commands.");
                } catch (error) {
                    BaseLogger.error(error);
                }
            } else {
                try {
                    BaseLogger.info("Refreshing all global slash commands..");
                    await rest.put(Routes.applicationCommands(this.clientId), {
                        body: SlashCommandUtil.getAllSlashCommandData(this.client)
                    });
                    await Util.sleep(1000);
                    BaseLogger.info("Successfully updated all global slash commands.");
                } catch (error) {
                    BaseLogger.error(error);
                }
            }
        } else if (this.action.delete && !this.action.deploy) {
            if (this.action.guild) {
                try {
                    BaseLogger.info("Deleting all guild slash commands...");
                    await rest.put(Routes.applicationGuildCommands(this.clientId,this.guildId), {
                        body: []});
                    BaseLogger.info("Successfully deleted all guild slash commands.");
                } catch (error) {
                    BaseLogger.error(error);
                }
            } else {
                try {
                    BaseLogger.info("Deleting all global slash commands...");
                    await rest.put(Routes.applicationCommands(this.clientId), {
                        body: []});
                    BaseLogger.info("Successfully deleted all global slash commands.");
                } catch (error) {
                    BaseLogger.error(error);
                }
            }
        }
    }
}