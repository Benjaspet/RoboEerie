import * as Discord from "discord.js";
import fetch from "node-fetch";
import {Client} from "discord.js";

export default class GitHubCommand {

    public name: string = <string> "github";
    public once: boolean = <boolean> false;
    public enabled = <boolean> true;
    public description: string = <string> "View information on a user's GitHub account.";

    constructor(client: Client) {
        this.enabled = true;
    }

    public async execute(interaction, client) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            const user = interaction.options.getString("user");
            await fetch(`https://api.github.com/users/${user}`)
                .then(res => res.json())
                .then(async body => {
                    if (body.message) {
                        return await interaction.reply({content: "The user was not found.", ephemeral: true});
                    }
                    const {
                        login, avatar_url,
                        html_url, public_repos,
                        followers, following, location,
                        company, created_at, bio
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

    public slashData: object = <object> {
        name: this.name,
        description: this.description,
        options: [
            {
                name: "user",
                description: "The GitHub username to search for.",
                type: "STRING",
                required: true
            }
        ]
    };

}