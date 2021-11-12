import * as Discord from "discord.js";
import fetch from "node-fetch";
import {Client} from "discord.js";
import {ICommand} from "../structs/ICommand";
import {SlashCommandOptions} from "../structs/ICommandOptions";
import EmbedUtil from "../utils/EmbedUtil";

export default class NPMCommand implements ICommand {

    public name: string = "npm";
    public once: boolean = false;
    public enabled: boolean = true;
    public description: string = "Look up an NPM package.";
    public aliases: string[] = [];
    protected client: Discord.Client;

    constructor(client: Client) {
        this.enabled = true;
        this.client = client;
    }

    public async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            const npmPackage = interaction.options.getString("package");
            try {
                await fetch('https://api.npms.io/v2/search?q=' + npmPackage)
                    .then(res => res.json())
                    .then(async data => {
                        const pkg = data.results[0].package;
                        const embed = new Discord.MessageEmbed()
                            .setTitle(pkg.name)
                            .setColor("#00e1ff")
                            .setURL(pkg.links.npm)
                            .setThumbnail('https://images-ext-1.discordapp.net/external/JsiJqfRfsvrh5IsOkIF_WmOd0_qSnf8lY9Wu9mRUJYI/https/images-ext-2.discordapp.net/external/ouvh4fn7V9pphARfI-8nQdcfnYgjHZdXWlEg2sNowyw/https/cdn.auth0.com/blog/npm-package-development/logo.png')
                            .setDescription(`${pkg.description}\n\n**Author:** ${pkg.author ? pkg.author.name : 'none'}\n**Version:** ${pkg.version}\n**Repository:** ${pkg.links.repository ? pkg.links.repository : 'none'}\n**Maintainers:** ${pkg.maintainers ? pkg.maintainers.map(e => e.username).join(', ') : 'none'}\n**Keywords:** ${pkg.keywords ? pkg.keywords.join(', ') : 'none'}`)
                            .setTimestamp()
                        await interaction.reply({embeds: [embed]});
                    });
            } catch (error) {
                await interaction.reply({embeds: [EmbedUtil.getErrorMessageEmbed("Could not find the specified NPM package.")]});
            }
        }
    }

    public slashData: object = <object> {
        name: this.name,
        description: this.description,
        options: [
            {
                name: "package",
                description: "The NPM package to search for.",
                type: SlashCommandOptions.STRING,
                required: true
            }
        ]
    };

}