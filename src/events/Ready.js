import {developer} from "../resources/config.json";
import SlashDataUtil from "../utils/slash/SlashDataUtil";

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {

        console.clear();
        console.log(`✔ Logged in as ${client.user.tag}.`);
        client.user.setActivity({type: "WATCHING", name: "over all channels."});

        if (developer["deploy-guild-slash-commands"] === true) {

            client.guilds.cache.get(developer["ponjo-test-guild"])?.commands.set(SlashDataUtil.getAllPonjoSlashCommandData())
                .then(response => console.log("All slash commands have been deployed to the development guild."));
        }

    },
};