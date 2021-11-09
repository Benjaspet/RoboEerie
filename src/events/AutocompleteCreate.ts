import TagUtil from "../utils/database/TagUtil";
import fetch from "node-fetch";

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction) {
        if (!interaction.isAutocomplete()) return;
        switch (interaction.commandName) {
            case "tag":
                switch (interaction.options.getSubcommand()) {
                    case "get":
                    case "search":
                    case "edit":
                    case "delete":
                        const similarResults = [];
                        const focusedValue = interaction.options.getFocused();
                        await TagUtil.findSimilarTags(focusedValue)
                            .then(async result => {
                                result.map(obj => {
                                    similarResults.push(obj.tag);
                                });
                            });
                        const filtered = similarResults.filter(choice => choice.startsWith(focusedValue)).slice(0, 5);
                        return await interaction.respond(filtered.map(choice => ({name: "🔹 " + choice, value: choice})));

                }
        }
    }
}