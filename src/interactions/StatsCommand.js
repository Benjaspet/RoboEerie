import * as Discord from "discord.js";
import * as stats from "cpu-stat";
import os from "os";

module.exports = {
    name: "interactionCreate",
    once: false,
    async execute(interaction, client) {

        if (!interaction.isCommand()) return;

        if (interaction.commandName === "stats") {

            stats.usagePercent(async function (error, percent, seconds) {

                if (error) return console.error(error);

                const cores = os.cpus().length;
                const cpuUsage = percent.toFixed(2);
                const cpuModel = os.cpus()[0].model;
                const nodeVersion = process.version;

                const embed = new Discord.MessageEmbed()
                    .setTitle("Ponjo Bot | Statistics")
                    .setColor("#00e1ff")
                    .setDescription(`Websocket latency: ${client.ws.ping}ms` + `\n` + `Interaction latency: ${Date.now() - interaction.createdTimestamp}ms`)
                    .addField("Host Information", `CPU: ${cpuModel}` + `\n` + `Cores: ${cores}` + `\n` + `CPU Usage: ${cpuUsage}` + `\n` + `Node Version: ${nodeVersion}`)
                    .setFooter("Ponjo", client.user.displayAvatarURL({dynamic: true}))
                    .setTimestamp()

                await interaction.reply({embeds: [embed]});


            });
        }
    }
}