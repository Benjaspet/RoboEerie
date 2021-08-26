import * as Discord from "discord.js";
import fetch from "node-fetch";

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, client) {

        if (!interaction.isCommand()) return;

        if (interaction.commandName === "github") {

            const user = interaction.options.getString("user");

            // const repository = interaction.options.getString("repository");

            await fetch(`https://api.github.com/users/${user}`)
                .then(res => res.json())
                .then(async body => {

                    if (body.message) {
                        return await interaction.reply({content: "The user was not found.", ephemeral: true});
                    }

                    const {
                        login, // The GitHub username.
                        avatar_url, // The account avatar URL.
                        name, // The account name.
                        html_url, // The link to the account profile.
                        public_repos, // The count of public repositories owned by the account.
                        followers, // The amount of followers the account has.
                        following, // The amount of accounts the user is following.
                        location,
                        company, // The information listed in the "company section" of the user's profile.
                        created_at, // When the account was created.
                        bio // The account's biography.
                    } = body;

                    const embed = new Discord.MessageEmbed()
                        .setTitle(`${login} - GitHub`)
                        .setAuthor(`${login}'s GitHub Profile`, avatar_url)
                        .setURL(html_url)
                        .setThumbnail(avatar_url)
                        .setColor("#00e1ff")
                        .setDescription(`‣ ${bio}` +
                            `\n‣ Public Repositories: ${public_repos}` +
                            `\n‣ Followers: ${followers}` +
                            `\n‣ Following: ${following}`)
                        .addFields(
                            {
                                name: "Company/Organization",
                                value: company || "None found.",
                                inline: false
                            },
                            {
                                name: "Account Location",
                                value: location || "None specified.",
                                inline: false
                            }
                        )
                        .setFooter(`Account created: ${created_at}`)

                    await interaction.reply({embeds: [embed]})

                });

        }
    }
}