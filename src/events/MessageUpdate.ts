import prohibitedWords from "../resources/json/ProhibitedWords";
import PonjoUtil from "../utils/PonjoUtil";

module.exports = {
    name: "messageUpdate",
    once: false,
    async execute(oldMessage, newMessage) {
        if (newMessage.channel.type == "dm") return;
        try {
            for (let index = 0; index < prohibitedWords.length; index++) {
                if (newMessage.content.includes(prohibitedWords[index])) {
                    await PonjoUtil.sleep(250);
                    await newMessage.delete();
                }
            }
        } catch (error) {
            // Pass.
        }
    }
}