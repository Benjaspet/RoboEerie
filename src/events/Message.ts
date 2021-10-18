import prohibitedWords from "../resources/json/ProhibitedWords";
import * as environment from "dotenv";

environment.config();

module.exports = {
    name: "messageCreate",
    once: false,
    async execute(message) {
        if (message.channel.type == "dm") return;
        if (process.env["FILTER-ENABLED"] == "true") {
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
}