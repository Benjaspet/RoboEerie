import config from "../resources/config.json";
import PonjoUtil from "../utils/PonjoUtil";

module.exports = {
    name: "messageDelete",
    once: true,
    execute(message, client) {

        if (message.author.bot || message.embeds[0]) return;

        PonjoUtil.getPonjoSnipeCollector().set(message.channel.id, {
            content: message.content,
            author: message.author,
            image: message.attachments.first() ? message.attachments.first().proxyURL : null
        });

    }
}