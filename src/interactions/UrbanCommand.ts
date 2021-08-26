import config from "../resources/Config";
import * as Discord from "discord.js";
import fetch from "node-fetch";
import PonjoUtil from "../utils/PonjoUtil";

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, client) {

        if (!interaction.isCommand()) return;

        if (interaction.commandName === "urban") {

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

                        // console.log({definition, permalink, upvotes, downVotes, writtenDate, example});

                    });

            } catch (error) {

                await interaction.reply({embeds: [PonjoUtil.getErrorMessageEmbed(client, "The specified query could not be found.")]});

            }
        }
    }
}