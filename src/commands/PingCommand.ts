import * as Discord from "discord.js";
import {Client} from "discord.js";

export default class PingCommand {

    public name: string = <string> "ping";
    public once: boolean = <boolean> false;
    public enabled = <boolean> true;
    public description: string = <string> "View the bot's client & websocket latency.";

    constructor(client: Client) {
        this.enabled = true;
    }

    public async execute(interaction, client) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            const embed = new Discord.MessageEmbed()
                .setTitle("Ponjo Bot | Latency")
                .setColor("#00e1ff")
                .setDescription(`Websocket latency: ${client.ws.ping}ms` + `\n` + `Interaction latency: ${interaction.createdTimestamp - Date.now()}ms`)
                .setFooter("Ponjo", client.user.displayAvatarURL({dynamic: true}))
                .setTimestamp()
            await interaction.reply({embeds: [embed]});
        }
    }

    public slashData: object = <object> {
        name: this.name,
        description: this.description,
    };

}