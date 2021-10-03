import {PonjoCommand} from "../interfaces/PonjoCommand";
import {Client, MessageEmbed} from "discord.js";
import EmbedUtil from "../utils/EmbedUtil";
import axios from "axios";
import {SlashCommandOptions} from "../interfaces/CommandOptions";

export default class BannerCommand implements PonjoCommand {

    public name: string = "banner";
    public once: boolean = false;
    public enabled: boolean = true;
    public description: string = "Display the banner of the mentioned user.";
    public aliases: string[] = [];
    protected client: Client;

    constructor(client: Client) {
        this.enabled = true;
        this.client = client;
    }

    public async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.channel.type === "dm" && interaction.commandName === this.name) {
            return await interaction.reply({embeds: EmbedUtil.fetchEmbedByType(this.client, "error", "You must run this command in a guild.")});
        }
        if (interaction.commandName === this.name) {
            const member = interaction.options.getMember("user");
            await interaction.deferReply();
            await axios.get(`https://discord.com/api/users/${member.id}`, {
                headers: {
                    Authorization: `Bot ${this.client.token}`
                },
            }).then(result => {
                const {banner, accent_color}: any = result.data;
                if (banner) {
                    const extension = <any>banner.startsWith("a_") ? ".gif" : ".png";
                    const url = `https://cdn.discordapp.com/banners/${member.id}/${banner}${extension}?size=1024`;
                    const embed = new MessageEmbed()
                        .setTitle(`${member.user.tag}'s Banner`)
                        .setColor(accent_color || "#00e1ff")
                        .setImage(url)
                    return interaction.editReply({embeds: [embed]});
                } else {
                    if (accent_color) {
                        axios.get(`https://www.thecolorapi.com/scheme?hex=${accent_color}format=json`)
                            .then(result => {
                                const {data} = result as any;
                                const hex = data.colors[0].hex.value;
                                const image = data.colors[0].image.bare;
                                const embed = new MessageEmbed()
                                    .setTitle(`${member.user.tag}'s Accent Color`)
                                    .setDescription(`**Hex:** \`${hex}\``)
                                    .setThumbnail(image)
                                return interaction.editReply({embeds: [embed]});
                            });
                    } else {
                        const embed = new MessageEmbed()
                            .setDescription(`${member.user.tag} does not have a banner.`)
                            .setColor("#00e1ff")
                        return interaction.editReply({embeds: [embed]});
                    }
                }
            });
        }
    }

    public slashData: object = <object>{
        name: this.name,
        description: this.description,
        options: [
            {
                name: "user",
                description: "The user whose banner you'd like to view.",
                type: SlashCommandOptions.USER,
                required: true
            }
        ]
    }
}
