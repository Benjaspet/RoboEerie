import config from "../resources/Config";
import * as Discord from "discord.js";
import fetch from "node-fetch";
import PonjoUtil from "../utils/PonjoUtil";
import {Client} from "discord.js";

export default class UrbanCommand {

    public name: string = <string> "urban";
    public once: boolean = <boolean> false;
    public enabled = <boolean> true;
    public description: string = <string> "Search the Urban Dictionary for a word.";

    constructor(client: Client) {
        this.enabled = true;
    }

    public async execute(interaction, client) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            const query = interaction.options.getString("query");
            const parsedQuery = encodeURIComponent(query);
            try {
                await fetch(`https://api.urbandictionary.com/v0/define?term=${parsedQuery}`)
                    .then((response) => response.json())
                    .then(async (data) => {
                        const word = data.list[0].word;
                        const definition = data.list[0].definition.replaceAll("\r", "").replaceAll("[", "").replaceAll("]", "");
                        const permalink = data.list[0].permalink;
                        const upvotes = data.list[0].thumbs_up;
                        const downVotes = data.list[0].thumbs_down;
                        const writtenDate = data.list[0].written_on;
                        const example = data.list[0].example.replaceAll("\r", "").replaceAll("[", "").replaceAll("]", "");
                        const embed = new Discord.MessageEmbed()
                            .setAuthor(word)
                            .setColor("#00e1ff")
                            .setDescription(`**URL:** [Click here](${permalink}).\n**Definition:** See below.` + `\n\n${definition}`)
                            .setFooter(`Ratings: 👍 ${upvotes} 👎 ${downVotes}`)
                        await interaction.reply({embeds: [embed]});
                    });
            } catch (error) {
                await interaction.reply({embeds: [PonjoUtil.getErrorMessageEmbed(client, "The specified query could not be found.")]});
            }
        }
    }

    public slashData: object = <object> {
        name: this.name,
        description: this.description,
        options: [
            {
                name: "query",
                description: "The word or phrase to search for.",
                type: "STRING",
                required: true
            }
        ]
    };

}