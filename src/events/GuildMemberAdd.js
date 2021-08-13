import config from "../resources/config.json";
import PonjoUtil from "../utils/PonjoUtil";

module.exports = {
    name: "guildMemberAdd",
    once: false,
    execute(member, client) {

        if (member.guild.id === config.developer["ponjo-test-guild"]) {
            PonjoUtil.sendServerWelcomeMessage(member);
        }

    }
}