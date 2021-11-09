import DatabaseUtil from "../utils/database/DatabaseUtil";
import TagUtil from "../utils/database/TagUtil";
import SlashCommandUtil from "../utils/SlashCommandUtil";

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        console.clear();
        console.log(`✔ Logged in as ${client.user.tag}.`);
        client.user.setActivity({type: "WATCHING", name: "over all channels."});
        await DatabaseUtil.connectToDatabase();
        await TagUtil.findSimilarTags("a")
            .then(async result => {
                const data = [];
                result.map(obj => {
                    data.push(obj.tag);
                });
                console.log(data)
            });
        await SlashCommandUtil.setAllSlashCommands(client, true)
    },
};