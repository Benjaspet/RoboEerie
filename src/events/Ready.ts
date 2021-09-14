import config from "../resources/Config";
import PonjoBuilder from "../builders/PonjoBuilder";
import SlashCommandUtil from "../utils/SlashCommandUtil";

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        console.clear();
        console.log(`✔ Logged in as ${client.user.tag}.`);
        client.user.setActivity({type: "WATCHING", name: "over all channels."});
        if (config.developer.deploySlashCommands === true) {
            await SlashCommandUtil.deployAllSlashCommands(this.client, true).then(() => {
                console.log("All slash commands have been deployed to the development guild.");
            });
        }
    },
};