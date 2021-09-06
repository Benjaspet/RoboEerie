import config from "../resources/Config";
import SlashDataUtil from "../utils/slash/SlashDataUtil";

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        console.clear();
        console.log(`✔ Logged in as ${client.user.tag}.`);
        client.user.setActivity({type: "WATCHING", name: "over all channels."});
        if (config.developer.deployGuildSlashCommandsOnReady === true) {
            client.guilds.cache.get(config.developer.ponjoGuild)?.commands.set(SlashDataUtil.getAllPonjoSlashCommandData())
                .then(response => console.log("All slash commands have been deployed to the development guild."));
        }
    },
};