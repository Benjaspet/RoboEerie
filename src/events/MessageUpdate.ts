import prohibitedWords from "../resources/json/ProhibitedWords";

module.exports = {
    name: "messageUpdate",
    once: false,
    async execute(oldMessage, newMessage) {
        if (newMessage.channel.type == "dm") return;
        if (process.env["FILTER-ENABLED"] == "true") {
            try {
                for (let index = 0; index < prohibitedWords.length; index++) {
                    if (newMessage.content.toLowerCase().includes(prohibitedWords[index].toString().toLowerCase())) {
                        await newMessage.delete();
                    }
                }
            } catch (error) {
                // Pass.
            }
        }
    }
}