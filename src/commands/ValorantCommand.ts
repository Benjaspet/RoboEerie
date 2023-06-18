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
import Command from "../structs/Command";

export default class ValorantCommand extends Command implements ApplicationCommand {

    private readonly client: Client;

    constructor(client: Client) {
        super("valorant", {
            name: "valorant",
            description: "Search up VALORANT player statistics.",
            options: [
                {
                    name: "username",
                    description: "The username & tag to search for.",
                    type: ApplicationCommandOptionTypes.STRING,
                    required: true
                }
            ]
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        const query = interaction.options.getString("username");
        const parsedQuery = encodeURIComponent(query);
        await interaction.deferReply();
        try {
            await fetch(`https://gameapi.benpetrillo.dev/v3/valorant/competitive/${parsedQuery}`)
                .then((response) => response.json())
                .then(async (data) => {
                    const username = data.data.username;
                    const rating = data.data.rating;
                    const rr = data.data.mmr;
                    const position = data.data.position;
                    const ratingIcon = data.data.ratingIcon;
                    const damagePerRound = data.data.specifics.damagePerRound;
                    const damagePerRoundPlacement = data.data.specifics.damagePerRoundPlacement;
                    const kdRatio = data.data.specifics.kdRatio;
                    const kdRatioPlacement = data.data.specifics.kdRatioPlacement;
                    const headshotPercentage = data.data.specifics.headshotPercentage;
                    const headshotPercentagePlacement = data.data.specifics.headshotPercentagePlacement;
                    const winPercentage = data.data.specifics.winPercentage;
                    const winPercentagePlacement = data.data.specifics.winPercentagePlacement;
                    const wins = data.data.specifics.wins;
                    const winsPlacement = data.data.specifics.winsPlacement;
                    const kast = data.data.specifics.kast;
                    const kastPlacement = data.data.specifics.kastPlacement;
                    const ddDelta = data.data.specifics.ddDelta;
                    const ddDeltaPlacement = data.data.specifics.ddDeltaPlacement;
                    const kills = data.data.specifics.kills;
                    const killsPlacement = data.data.specifics.killsPlacement;
                    const deaths = data.data.specifics.deaths;
                    const assists = data.data.specifics.assists;
                    const acs = data.data.specifics.acs;
                    const acsPlacement = data.data.specifics.acsPlacement;
                    const kad = data.data.specifics.kad;
                    const killsPerRound = data.data.specifics.killsPerRound;
                    const firstBloods = data.data.specifics.firstBloods;
                    const flawless = data.data.specifics.flawless;
                    const aces = data.data.specifics.aces;
                    const embed = new MessageEmbed()
                        .setAuthor({name: username})
                        .setThumbnail(ratingIcon)
                        .setColor("#ff5062")
                        .addFields([
                            {
                                name: "Competitive Statistics",
                                value: `• Username: **${username}**` + `\n`
                                    + `• Rating: **${rating} (${rr})**` + `\n`
                                    + `• Position: **${position}**`,
                                inline: false
                            },
                            {
                                name: "Specifics",
                                value: `• Damage/R: **${damagePerRound} (${damagePerRoundPlacement})**` + `\n`
                                    + `• K/D: **${kdRatio} (${kdRatioPlacement})**` + `\n`
                                    + `• Headshot%: **${headshotPercentage} (${headshotPercentagePlacement})**` + `\n`
                                    + `• Win%: **${winPercentage} (${winPercentagePlacement})**` + `\n`
                                    + `• Wins: **${wins} (${winsPlacement})** ` + `\n`
                                    + `• KAST: **${kast} (${kastPlacement})**` + `\n`
                                    + `• DDΔ: **${ddDelta} (${ddDeltaPlacement})**` + `\n`
                                    + `• Kills: **${kills} (${killsPlacement})**` + `\n`
                                    + `• Deaths: **${deaths}**` + `\n`
                                    + `• Assists: **${assists}**` + `\n`
                                    + `• ACS: **${acs} (${acsPlacement})**` + `\n`
                                    + `• KAD: **${kad}**` + `\n`
                                    + `• Kills/Round: **${killsPerRound}**` + `\n`
                                    + `• First Bloods: **${firstBloods}**` + `\n`
                                    + `• Flawless: **${flawless}**` + `\n`
                                    + `• Aces: **${aces}**`,
                                inline: false
                            }
                        ])
                        .setFooter({text: "Mr. Code & Watch", iconURL: this.client.user.displayAvatarURL()})
                        .setTimestamp();
                    return void await interaction.editReply({embeds: [embed]});
                });
        } catch (error) {
            return void await interaction.editReply({embeds: [EmbedUtil.getErrorEmbed("Invalid username provided.")]});
        }
    }

    public getName(): string {
        return this.name;
    }

    public getCommandData(): ApplicationCommandData {
        return this.data;
    }
}