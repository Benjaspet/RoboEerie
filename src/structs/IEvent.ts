import {Client, ClientEvents} from "discord.js";

export interface IEvent {
    name: keyof ClientEvents;
    readonly client: Client;
    once: boolean;
    execute(...args: any): any;
}