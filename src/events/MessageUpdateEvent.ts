import {IEvent} from "../interfaces/IEvent";
import {Client, ClientEvents, Message} from "discord.js";
import prohibitedWords from "../resources/json/ProhibitedWords";
import BaseConfig from "../base/BaseConfig";

export default class MessageUpdateEvent implements IEvent {

    public name: keyof ClientEvents;
    public once: boolean;
    public client: Client;

    constructor(client: Client, name: keyof ClientEvents, once: boolean) {
        this.client = client;
        this.once = once;
        this.name = name;
    }

    public async execute(oldMessage: Message, newMessage: Message) {
        if (newMessage.channel.type == "DM") return;
        if (BaseConfig.get("FILTER_ENABLED") == "true") {
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