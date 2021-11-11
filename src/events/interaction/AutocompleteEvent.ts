import {IEvent} from "../../structs/IEvent";
import {Client, ClientEvents, Interaction} from "discord.js";
import TagUtil from "../../utils/database/TagUtil";

export default class AutocompleteEvent implements IEvent {

    public name: keyof ClientEvents;
    public once: boolean;
    public client: Client;

    constructor(client: Client, name: keyof ClientEvents, once: boolean) {
        this.client = client;
        this.once = once;
        this.name = name;
    }

    public async execute(interaction: Interaction) {
        if (!interaction.isAutocomplete()) return;
        switch (interaction.commandName) {
            case "tag":
                switch (interaction.options.getSubcommand()) {
                    case "get":
                    case "search":
                    case "edit":
                    case "delete":
                        const similarResults = [];
                        const focusedValue = interaction.options.getFocused() as string;
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