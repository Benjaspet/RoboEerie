import * as Discord from "discord.js";
import {Client} from "discord.js";
import {PonjoCommand} from "../interfaces/PonjoCommand";

export default class PingCommand implements PonjoCommand {

    public name: string = "ping";
    public once: boolean = false;
    public enabled: boolean = true;
    public description: string = "View the bot's client & websocket latency.";
    public aliases: string[] = [];
    protected client: Discord.Client;

    constructor(client: Client) {
        this.enabled = true;
        this.client = client;
    }

    public async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            const embed = new Discord.MessageEmbed()
                .setTitle("Ponjo Bot | Latency")
                .setColor("#00e1ff")
                .setDescription(`Websocket latency: ${this.client.ws.ping}ms` + `\n` + `Interaction latency: ${interaction.createdTimestamp - Date.now()}ms`)
                .setFooter("Ponjo", this.client.user.displayAvatarURL({dynamic: true}))
                .setTimestamp()
            await interaction.reply({embeds: [embed]});
        }
    }

    public slashData: object = <object> {
        name: this.name,
        description: this.description,
    };

}