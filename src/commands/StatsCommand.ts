import * as Discord from "discord.js";
import * as stats from "cpu-stat";
import * as os from "os";
import {Client} from "discord.js";
import {ICommand} from "../structs/ICommand";

export default class StatsCommand implements ICommand {

    public name: string = "stats";
    public once: boolean = false;
    public enabled: boolean = true;
    public description: string = "Display all statistics for the Ponjo bot.";
    public aliases: string[] = [];
    protected client: Discord.Client;

    constructor(client: Client) {
        this.enabled = true;
        this.client = client;
    }

    public async execute(interaction, client) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            stats.usagePercent(async function (error, percent) {
                if (error) return console.error(error);
                const cores = os.cpus().length;
                const cpuUsage = percent.toFixed(2);
                const cpuModel = os.cpus()[0].model;
                const nodeVersion = process.version;
                const embed = new Discord.MessageEmbed()
                    .setTitle("Ponjo Bot | Statistics")
                    .setColor("#00e1ff")
                    .setDescription(`Library: Discord.js v${require("discord.js").version}` + `\n` + "Node.js: Version " + process.version + `\n` + `Websocket latency: ${client.ws.ping}ms` + `\n` + `Interaction latency: ${Date.now() - interaction.createdTimestamp}ms`)
                    .addField("Bot Information", `Developer: Eerie#6560` + `\n` + `Language: TypeScript` + `\n` + `Library: Discord.js v13.0.1`)
                    .addField("Host Information", `CPU: ${cpuModel}` + `\n` + `Cores: ${cores}` + `\n` + `CPU Usage: ${cpuUsage}` + `\n` + `Node Version: ${nodeVersion}`)
                    .setFooter("Ponjo", client.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()
                await interaction.reply({embeds: [embed]});
            });
        }
    }

    public slashData: object = <object> {
        name: this.name,
        description: this.description
    };

}