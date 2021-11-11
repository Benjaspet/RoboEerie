import {IEvent} from "../../structs/IEvent";
import {Client, ClientEvents, Message} from "discord.js";
import BaseConfig from "../../base/BaseConfig";
import prohibitedWords from "../../resources/ProhibitedWords";

export default class MessageCreateEvent implements IEvent {

    public name: keyof ClientEvents;
    public once: boolean;
    public client: Client;

    constructor(client: Client, name: keyof ClientEvents, once: boolean) {
        this.client = client;
        this.once = once;
        this.name = name;
    }

    public async execute(message: Message) {
        if (message.channel.type == "DM") return;
        const setting: string = BaseConfig.get("FILTER-ENABLED") as string;
        if (JSON.parse(setting) == true) {
            try {
                for (let index = 0; index < prohibitedWords.length; index++) {
                    if (message.content.toLowerCase().includes(prohibitedWords[index].toString().toLowerCase())) {
                        await message.delete();
                    }
                }
            } catch (error) {
                return;
            }
        }
    }

}