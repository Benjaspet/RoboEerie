import AvatarCommand from "../interactions/AvatarCommand";
import BanCommand from "../interactions/BanCommand";
import DeployCommand from "../interactions/DeployCommand";
import config from "../resources/Config";

export default class SlashCommandUtil {

    public static deployAllSlashCommands(client, guild: boolean = true) {
        const slashCommandData = [
            new AvatarCommand(client).slashData,
            new BanCommand(client).slashData,
            new DeployCommand(client).slashData
        ];
        if (guild) {
            for (const data of slashCommandData) {
                client.guilds.cache.get(config.developer.ponjoGuild)?.commands.set(data);
            }
        }
        if (!guild) {
            for (const data of slashCommandData) {
                client.application?.commands.set(data);
            }
        }
    }

    public static deleteAllSlashCommands(client, guild: boolean = true) {
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