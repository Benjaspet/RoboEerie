import DatabaseUtil from "../utils/database/DatabaseUtil";
import SlashCommandUtil from "../utils/SlashCommandUtil";

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        console.clear();
        console.log(`✔ Logged in as ${client.user.tag}.`);
        client.user.setActivity({type: "WATCHING", name: "over all channels."});
        await DatabaseUtil.connectToDatabase();
    },
};