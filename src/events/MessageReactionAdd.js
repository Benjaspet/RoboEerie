import PonjoUtil from "../utils/PonjoUtil";
import config from "../resources/config.json";

module.exports = {
    name: "messageReactionAdd",
    once: false,
    async execute(reaction, user) {

        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();
        if (user.bot) return;
        if (!reaction.message.guild) return;

        if (reaction.message.channel.id === config.ponjo_development["verification-channel"]) {

            const role = reaction.message.guild.roles.cache.find(role => role.name === "Verified Member");
            await reaction.message.guild.members.cache.get(user.id).roles.add(role);

        }
    }
}