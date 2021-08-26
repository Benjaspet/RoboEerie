import config from "../../resources/Config";
import SlashDataUtil from "../../utils/slash/SlashDataUtil";

export default class SlashCommandUtil {

    static async deployAllSlashCommands(client, global = false) {

        if (global === false) {

            client.guilds.cache.get(config.developer.ponjoGuild)?.commands.set(SlashDataUtil.getAllPonjoSlashCommandData())
                .then(response => console.log("All slash commands have been deployed to the development guild."));


        } else if (global === true) {

            client.application?.commands.set(SlashDataUtil.getAllPonjoSlashCommandData())
                .then(response => console.log("All slash commands have been globally deployed."));

        }
    }
}