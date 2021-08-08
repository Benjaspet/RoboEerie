import Discord from "discord.js";
import fetch from "node-fetch";
import {MemeSnippet} from "../docs/ponjoapi/MemeSnippet";

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, client) {

        if (!interaction.isCommand()) return;

        if (interaction.commandName === "docs") {

            const {value: string} = interaction.options.get("library");
            const {value: query} = interaction.options.get("query");

            switch (string) {

                case "djs-v13":

                    const url = `https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(query)}`;

                    const documentationFetch = await fetch(url);
                    const response = await documentationFetch.json();

                    const embed = new Discord.MessageEmbed()
                        .setAuthor(response.author.name, response.author.icon_url)
                        .setURL(response.author.url)
                        .setColor("#00e1ff")
                        .setDescription(response.description)
                        .addField("Wanna view source code?", `Simply [click here](${response.author.url}).`)
                        .setFooter("Discord.js v13 Documentation", client.user.displayAvatarURL({dynamic: true}))
                        .setTimestamp()

                    await interaction.reply({embeds: [embed]});

                    break;

                case "ponjo-api":

                    const embed2 = new Discord.MessageEmbed()
                        .setTitle("Meme Endpoint")
                        .setColor("#00e1ff")
                        .setDescription(MemeSnippet.getEndpointResponseSnippet())
                        .addField("Example Output", "```js\n" + `This is a string.` + "\n```")

                    await interaction.reply({embeds: [embed2]});

                    break;

            }
        }
    }
}