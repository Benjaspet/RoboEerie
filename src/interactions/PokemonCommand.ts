import * as Discord from "discord.js";
import PonjoUtil from "../utils/PonjoUtil";
import fetch from "node-fetch";

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, client) {

        if (!interaction.isCommand()) return;
        if (interaction.commandName === "pokemon") {
            const species: string = <string>interaction.options.getString("species");
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
                return await interaction.reply({embeds: [PonjoUtil.getErrorMessageEmbed(client, "That Pokémon was not found.")]});
            }
        }
    }
}