import config from "../resources/Config";
import TagUtil from "../utils/database/TagUtil";

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction) {
        if (!interaction.isAutocomplete()) return;
        switch (interaction.commandName) {
            case "tag":
                switch (interaction.options.getSubcommand()) {
                    case "get":
                        const similarResults = [];
                        const focusedValue = interaction.options.getFocused();
                        await TagUtil.findSimilarTags(focusedValue)
                            .then(async result => {
                                result.map(obj => {
                                    similarResults.push(obj.tag);
                                });
                            });
                        const filtered = similarResults.filter(choice => choice.startsWith(focusedValue)).slice(0, 20);
                        await interaction.respond(filtered.map(choice => ({name: choice, value: choice})));
                }
        }
    }
}