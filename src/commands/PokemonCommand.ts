import * as Discord from "discord.js";
import PonjoUtil from "../utils/PonjoUtil";
import fetch from "node-fetch";
import {Client} from "discord.js";
import {ICommand} from "../structs/ICommand";
import {SlashCommandOptions} from "../structs/ICommandOptions";

export default class PokemonCommand implements ICommand {

    public name: string = "pokemon";
    public once: boolean = false;
    public enabled: boolean = true;
    public description: string = "View information on a specific Pokémon.";
    public aliases: string[] = [];
    protected client: Discord.Client;

    constructor(client: Client) {
        this.enabled = true;
        this.client = client;
    }

    public async execute(interaction) {
        if (!interaction.isCommand()) return;
        if (interaction.commandName === this.name) {
            const species: string = <string> interaction.options.getString("species").toLowerCase();
            try {
                await fetch("https://pokeapi.co/api/v2/pokemon/" + species)
                    .then(response => response.json())
                    .then(data => {
                        const pokemon = {
                            name: PonjoUtil.capitalize(data.name),
                            image: data.sprites['front_default'],
                            shinyImage: data.sprites['front_shiny'],
                            type: data.types.map((type) => PonjoUtil.capitalize(type.type.name)).join(' and '),
                            id: data.id,
                            hp: data.stats[0].base_stat,
                            attack: data.stats[1].base_stat,
                            defense: data.stats[2].base_stat,
                            specialAttack: data.stats[3].base_stat,
                            specialDefense: data.stats[4].base_stat,
                            speed: data.stats[5].base_stat,
                            weight: data.weight,
                        };
                        const embed = new Discord.MessageEmbed()
                            .setTitle(pokemon.name)
                            .setColor("#00e1ff")
                            .setThumbnail(pokemon.image)
                            .setDescription(`**Pokémon Name:** ${PonjoUtil.capitalize(pokemon.name)}\n**Pokédex ID:** ${pokemon.id}\n\n**Type:** ${pokemon.type}\n**Hitpoints:** ${pokemon.hp}\n**Attack:** ${pokemon.attack}\n**Defense:** ${pokemon.defense}\n**Special Attack:** ${pokemon.specialAttack}\n**Special Defense:** ${pokemon.specialDefense}\n\n**Speed:** ${pokemon.speed}\n**Weight:** ${pokemon.weight} kg`)
                            .setFooter(PonjoUtil.capitalize(pokemon.name), pokemon.shinyImage)
                            .setTimestamp()
                        return interaction.reply({embeds: [embed]});
                    });
            } catch (error) {
                console.log(error)
                return await interaction.reply({embeds: [PonjoUtil.getErrorMessageEmbed(this.client, "That Pokémon was not found.")]});
            }
        }
    }

    public slashData: object = <object> {
        name: this.name,
        description: this.description,
        options: [
            {
                name: "species",
                description: "The species of Pokémon to search up.",
                type: SlashCommandOptions.STRING,
                required: true
            }
        ]
    };

}