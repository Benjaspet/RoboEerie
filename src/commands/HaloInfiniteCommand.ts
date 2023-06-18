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

export default class HaloInfiniteCommand extends Command implements ApplicationCommand {

    private readonly client: Client;

    constructor(client: Client) {
        super("haloinfinite", {
            name: "haloinfinite",
            description: "Search up Halo Infinite player statistics.",
            options: [
                {
                    name: "username",
                    description: "The username to search for.",
                    type: ApplicationCommandOptionTypes.STRING,
                    required: true
                },
                {
                    name: "type",
                    description: "The type of statistics to search for.",
                    type: ApplicationCommandOptionTypes.STRING,
                    required: true,
                    choices: [
                        {
                            name: "Ranked Arena",
                            value: "ranked"
                        },
                        {
                            name: "Overall",
                            value: "overall"
                        }],
                }
            ],
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        const username = interaction.options.getString("username");
        const type = interaction.options.getString("type");
        const parsedUsername = encodeURIComponent(username);
        await interaction.deferReply();
        try {
            await fetch(`https://gameapi.benpetrillo.dev/v3/haloinfinite/${type}/${parsedUsername}`)
                .then((response) => response.json())
                .then(async (data) => {
                    const username = data.data.username;
                    const playtime = data.data.playtime;
                    const totalMatches = data.data.totalMatches;
                    const peakRankName = data.data.peakRankName;
                    const peakRankMmr = data.data.peakRankMmr;
                    const peakRankIcon = data.data.peakRankIcon;
                    const currRankName = data.data.currRankName;
                    const currRankMmr = data.data.currRankMmr;
                    const currRankIcon = data.data.currRankIcon;
                    const currRankPos = data.data.currRankPos;
                    const kdRatio = data.data.kdRatio;
                    const winPercentage = data.data.winPercentage;
                    const averageKda = data.data.averageKDA;
                    const averageDamage = data.data.averageDamage;
                    const kills = data.data.specifics.kills;
                    const deaths = data.data.specifics.deaths;
                    const assists = data.data.specifics.assists;
                    const headshots = data.data.specifics.headshots;
                    const damageTaken = data.data.specifics.damageTaken;
                    const damageDealt = data.data.specifics.damageDealt;
                    const betrayals = data.data.specifics.betrayals;
                    const suicides = data.data.specifics.suicides;
                    const score = data.data.specifics.score;
                    const matchesWon = data.data.matches.matchesWon;
                    const matchesLost = data.data.matches.matchesLost;
                    const matchesNotFinished = data.data.matches.matchesNotFinished;
                    const shotAccuracy = data.data.shots.shotAccuracy;
                    const shotsFired = data.data.shots.shotsFired;
                    const shotsHit = data.data.shots.shotsHit;
                    const headshotAccuracy = data.data.shots.headshotAccuracy;
                    const headshotsHit = data.data.shots.headshotHits;
                    const embed = new MessageEmbed()
                        .setAuthor({name: username})
                        .setDescription(`Current rank: **${currRankPos}**`)
                        .setThumbnail(currRankIcon)
                        .setColor("#00A36C")
                        .addFields([
                            {
                                name: "Ranked Statistics",
                                value: `• Username: **${username}**` + `\n`
                                    + `• Playtime: **${playtime}**` + `\n`
                                    + `• Total Matches: **${totalMatches}**` + `\n`
                                    + `• Peak Rank: **${peakRankName} (${peakRankMmr})**` + `\n`
                                    + `• Current Rank: **${currRankName} (${currRankMmr})**` + `\n`
                                    + `• Position: **${currRankPos}**` + `\n`,
                                inline: false
                            },
                            {
                                name: "General Statistics",
                                value: `• K/D Ratio: **${kdRatio}**` + `\n`
                                    + `• Win Percentage: **${winPercentage}**` + `\n`
                                    + `• Average KDA: **${averageKda}**` + `\n`
                                    + `• Average Damage: **${averageDamage}**` + `\n`
                                    + `• Kills: **${kills}**` + `\n`
                                    + `• Deaths: **${deaths}**` + `\n`
                                    + `• Assists: **${assists}**` + `\n`
                                    + `• Headshots: **${headshots}**` + `\n`
                                    + `• Damage Taken: **${damageTaken}**` + `\n`
                                    + `• Damage Dealt: **${damageDealt}**` + `\n`
                                    + `• Betrayals: **${betrayals}**` + `\n`
                                    + `• Suicides: **${suicides}**` + `\n`
                                    + `• Score: **${score}**` + `\n`,
                                inline: false
                            },
                            {
                                name: "Match Statistics",
                                value: `• Matches Won: **${matchesWon}**` + `\n`
                                    + `• Matches Lost: **${matchesLost}**` + `\n`
                                    + `• Matches Not Finished: **${matchesNotFinished}**` + `\n`,
                                inline: false
                            },
                            {
                                name: "Shot Statistics",
                                value: `• Shot Accuracy: **${shotAccuracy}**` + `\n`
                                    + `• Shots Fired: **${shotsFired}**` + `\n`
                                    + `• Shots Hit: **${shotsHit}**` + `\n`
                                    + `• Headshot Accuracy: **${headshotAccuracy}**` + `\n`
                                    + `• Headshots Hit: **${headshotsHit}**` + `\n`,
                                inline: false
                            }
                        ])
                        .setFooter({text: "Mr Code & Watch", iconURL: this.client.user.displayAvatarURL()})
                        .setTimestamp();
                    return void await interaction.editReply({embeds: [embed]});
                });
        } catch (error) {
            return void await interaction.reply({embeds: [EmbedUtil.getErrorEmbed("Invalid username provided.")]});
        }
    }

    public getName(): string {
        return this.name;
    }

    public getCommandData(): ApplicationCommandData {
        return this.data;
    }
}