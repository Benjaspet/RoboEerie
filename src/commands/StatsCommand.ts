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
import * as stats from "cpu-stat";
import * as os from "os";
import Command from "../structs/Command";
import MrCodeAndWatchConstants from "../constants/MrCodeAndWatchConstants";
import client from "../MrCodeAndWatch";

export default class StatsCommand extends Command implements ApplicationCommand {

    private readonly client: Client;

    constructor(client: Client) {
        super("stats", {
            name: "stats",
            description: "Display all statistics for RoboEerie."
        });
        this.client = client;
    }

    public async execute(interaction: CommandInteraction): Promise<void> {
        await interaction.deferReply();
        stats.usagePercent(async function (error, percent) {
            const cores = os.cpus().length;
            const cpuUsage = percent.toFixed(2);
            const cpuModel = os.cpus()[0].model;
            const embed = new MessageEmbed()
                .setTitle("Mr. Code & Watch | Statistics")
                .setColor(MrCodeAndWatchConstants.DEFAULT_EMBED_COLOR)
                .setDescription("• Node.js: Version " + process.version + `\n` + `• Websocket latency: ${client.ws.ping}ms`)
                .addFields([
                    {
                        name: "Bot Information",
                        value: `• Developer: benjaspet` + `\n` + `• Language: TypeScript` + `\n` + `• Library: Discord.js v${require("discord.js").version}`,
                        inline: false
                    },
                    {
                        name: "Host Information",
                        value: `• CPU: ${cpuModel}` + `\n` + `• Cores: ${cores}` + `\n` + `• CPU Usage: ${cpuUsage}`,
                        inline: false
                    }
                ])
                .setFooter({text: "Mr. Code & Watch", iconURL: client.user.displayAvatarURL({dynamic: true})})
                .setTimestamp();
            return void await interaction.editReply({embeds: [embed]});
        });
    }

    public getName(): string {
        return this.name;
    }

    public getCommandData(): ApplicationCommandData {
        return this.data;
    }
}