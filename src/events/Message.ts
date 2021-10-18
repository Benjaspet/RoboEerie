import prohibitedWords from "../resources/json/ProhibitedWords";

module.exports = {
    name: "messageCreate",
    once: false,
    async execute(message) {
        if (message.channel.type == "dm") return;
        try {
            for (let index = 0; index < prohibitedWords.length; index++) {
                if (message.content.toLowerCase().includes(prohibitedWords[index].toString().toLowerCase())) {
                    await message.delete();
                }
            }
        } catch (error) {
            // Pass.
        }
    }
}