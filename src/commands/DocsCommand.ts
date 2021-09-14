import * as Discord from "discord.js";
import {Client} from "discord.js";
import fetch from "node-fetch";
import {PonjoCommand} from "../interfaces/PonjoCommand";
import {SlashCommandOptions} from "../interfaces/CommandOptions";

export default class DocsCommand implements PonjoCommand {

    public name: string = "docs";
    public once: boolean = false;
    public enabled: boolean = true;
    public description: string = "View documentation for the specified app or library.";
    public aliases: string[] = [];
    protected client: Discord.Client;

    constructor(client: Client) {
        this.enabled = true;
        this.client = client;
    }

    public async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
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
                        .setFooter("Discord.js v13 Documentation", this.client.user.displayAvatarURL({dynamic: true}))
                        .setTimestamp()
                    await interaction.reply({embeds: [embed]});
                    break;
            }
        }
    }

    public slashData: object = {
        name: this.name,
        description: this.description,
        options: [
            {
                name: "library",
                description: "The library you'd like to view the documentation of.",
                type: SlashCommandOptions.STRING,
                required: true,
                choices: [
                    {
                        name: "Discord.js v13",
                        value: "djs-v13"
                    },
                    {
                        name: "Ponjo API",
                        value: "ponjo-api"
                    }
                ]
            },
            {
                name: "query",
                description: "The query to search the documentation for.",
                type: SlashCommandOptions.STRING,
                required: true
            }
        ]
    };

}