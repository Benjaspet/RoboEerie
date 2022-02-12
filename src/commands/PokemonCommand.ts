/*
 * Copyright © 2022 Ben Petrillo. All rights reserved.
 *
 * Project licensed under the MIT License: https://www.mit.edu/~amini/LICENSE.md
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * All portions of this software are available for public use, provided that
 * credit is given to the original author(s).
 */

import {ApplicationCommandData, Client, CommandInteraction, MessageEmbed} from "discord.js";
import {ApplicationCommand} from "../types/ApplicationCommand";
import {ApplicationCommandOptionTypes} from "discord.js/typings/enums";
import fetch from "node-fetch";
import EmbedUtil from "../utils/EmbedUtil";
import Utilities from "../utils/Utilities";
import Command from "../structs/Command";
import Logger from "../structs/Logger";

export default class PokemonCommand extends Command implements ApplicationCommand {

    private readonly client: Client;

    constructor(client: Client) {
        super("pokemon", {
            name: "pokemon",
            description: "View information on a specific Pokémon.",
            options: [
                {
                    name: "species",
                    description: "The species of Pokémon to search up.",
                    type: ApplicationCommandOptionTypes.STRING,
                    required: true
                }
            ]
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        const species: string = interaction.options.getString("species").toLowerCase();
        try {
            await fetch("https://pokeapi.co/api/v2/pokemon/" + species)
                .then(response => response.json())
                .then(async data => {
                    const pokemon = {
                        name: Utilities.capitalize(data.name),
                        image: data.sprites['front_default'],
                        shinyImage: data.sprites['front_shiny'],
                        type: data.types.map((type) => Utilities.capitalize(type.type.name)).join(" and "),
                        id: data.id,
                        hp: data.stats[0].base_stat,
                        attack: data.stats[1].base_stat,
                        defense: data.stats[2].base_stat,
                        specialAttack: data.stats[3].base_stat,
                        specialDefense: data.stats[4].base_stat,
                        speed: data.stats[5].base_stat,
                        weight: data.weight,
                    };
                    const embed = new MessageEmbed()
                        .setTitle(pokemon.name)
                        .setColor("#00e1ff")
                        .setThumbnail(pokemon.image)
                        .setDescription(`**Pokémon Name:** ${pokemon.name}\n**Pokédex ID:** ${pokemon.id}\n\n**Type:** ${pokemon.type}\n**Hitpoints:** ${pokemon.hp}\n**Attack:** ${pokemon.attack}\n**Defense:** ${pokemon.defense}\n**Special Attack:** ${pokemon.specialAttack}\n**Special Defense:** ${pokemon.specialDefense}\n\n**Speed:** ${pokemon.speed}\n**Weight:** ${pokemon.weight} kg`)
                        .setFooter({text: pokemon.name, iconURL: pokemon.shinyImage})
                        .setTimestamp()
                    return void await interaction.reply({embeds: [embed]});
                });
        } catch (error) {
            Logger.error(error);
            return void await interaction.reply({embeds: [EmbedUtil.getErrorEmbed("That Pokémon was not found.")]});
        }
    }

    public getName(): string {
            return this.name;
        }

    public getCommandData(): ApplicationCommandData {
        return this.data;
    }
}