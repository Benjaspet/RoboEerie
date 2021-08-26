import config from "../resources/Config";
import PonjoUtil from "../utils/PonjoUtil";

module.exports = {
    name: "guildMemberAdd",
    once: false,
    execute(member, client) {

        if (member.guild.id === config.developer.ponjoGuild) {
            PonjoUtil.sendServerWelcomeMessage(member);
        }

    }
}