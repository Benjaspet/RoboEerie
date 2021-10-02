import prohibitedWords from "../resources/json/ProhibitedWords";
import PonjoUtil from "../utils/PonjoUtil";


module.exports = {
    name: "messageCreate",
    once: false,
    async execute(message) {
        if (message.channel.type == "dm") return;
        try {
            for (let index = 0; index < prohibitedWords.length; index++) {
                if (message.content.includes(prohibitedWords[index])) {
                    await PonjoUtil.sleep(250);
                    await message.delete();
                }
            }
        } catch (error) {
            // Pass.
        }
    }
}