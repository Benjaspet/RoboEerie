import Discord from "discord.js";

module.exports = {
    name: "interactionCreate",
    once: true,
    async execute(interaction, client) {

        if (!interaction.isCommand()) return;

        if (interaction.commandName === "github") {

            const content = interaction.options.getString("description");
            const channel = interaction.options.getChannel("channel");

            interaction.reply({content: "The poll was successfully published."});

            const embed = new Discord.MessageEmbed()
                .setTitle("Server Poll")
                .setColor("#00e1ff")
                .setDescription(content)
                .setFooter(interaction.user.tag,client.user.displayAvatarURL({dynamic: true}))
                .setTimestamp()

            channel.send({embeds: [embed]})
                .then(async msg => {
                    await msg.react(emojis.success);
                    await msg.react(emojis.error);
                });

        }
    }
}