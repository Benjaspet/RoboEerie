import config from "../resources/Config";
import PonjoUtil from "../utils/PonjoUtil";

module.exports = {
    name: "guildMemberAdd",
    once: false,
    async execute(member) {
        if (member.guild.id === config.guild) {
            PonjoUtil.sendServerWelcomeMessage(member);
        }
    }
}