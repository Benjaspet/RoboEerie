import {IEvent} from "../../structs/IEvent";
import {Client, ClientEvents, Message, PartialMessage} from "discord.js";
import prohibitedWords from "../../resources/ProhibitedWords";
import BaseConfig from "../../base/BaseConfig";

export default class MessageUpdateEvent implements IEvent {

    public name: keyof ClientEvents;
    public once: boolean;
    public client: Client;

    constructor(client: Client, name: keyof ClientEvents, once: boolean) {
        this.client = client;
        this.once = once;
        this.name = name;
    }

    public async execute(oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage) {
        if (newMessage.channel.type == "DM") return;
        const setting: string = BaseConfig.get("FILTER-ENABLED") as string;
        if (JSON.parse(setting) == true) {
            try {
                for (let index = 0; index < prohibitedWords.length; index++) {
                    if (newMessage.content.toLowerCase().includes(prohibitedWords[index].toString().toLowerCase())) {
                        await newMessage.delete();
                    }
                }
            } catch (error) {
               return;
            }
        }
    }
}