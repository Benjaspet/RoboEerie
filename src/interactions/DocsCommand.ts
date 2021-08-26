import * as Discord from "discord.js";
import fetch from "node-fetch";

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
                        .setAuthor(response.author.name, "https://cdn.discordapp.com/emojis/851461487498493952.png?v=1")
                        .setURL(response.author.url)
                        .setColor("#00e1ff")
                        .setDescription(response.description)
                        .addField("Wanna view the source?", `Simply [click here](https://discord.js.org/#/docs/main/stable/general/welcome).`)
                        .setFooter("Discord.js v13 Documentation", client.user.displayAvatarURL({dynamic: true}))
                        .setTimestamp()

                    await interaction.reply({embeds: [embed]});
                    break;

            }
        }
    }
}