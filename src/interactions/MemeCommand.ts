import fetch from "node-fetch";
import * as Discord from "discord.js";

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, client) {

        if (!interaction.isCommand()) return;
        if (interaction.commandName === "meme") {
            const subreddit: string = <string>interaction.options.getString("subreddit");
            await interaction.deferReply();
            if (!subreddit) {
                await fetch("https://meme-api.herokuapp.com/gimme")
                    .then(response => response.json())
                    .then(data => {
                        const embed = new Discord.MessageEmbed()
                            .setTitle(data.title)
                            .setColor("#00e1ff")
                            .setImage(data.url)
                            .setFooter("Upvotes: " + data.ups + " | Posted by: " + data.author)
                        return interaction.editReply({embeds: [embed]});
                    });
            }
            if (subreddit) {
                await fetch("https://meme-api.herokuapp.com/gimme/" + subreddit)
                    .then(response => response.json())
                    .then(data => {
                        const embed = new Discord.MessageEmbed()
                            .setTitle(data.title)
                            .setColor("#00e1ff")
                            .setImage(data.url)
                            .setFooter("Upvotes: " + data.ups + " | Posted by: " + data.author)
                        return interaction.editReply({embeds: [embed]});
                    });
            }
        }
    }
}