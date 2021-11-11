import {Client} from "discord.js";
import ReadyEvent from "../events/ReadyEvent";
import MessageUpdateEvent from "../events/MessageUpdateEvent";

export default class EventBase {

    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
        this.initAllEvents().then(() => {});
    }

    private async initAllEvents() {

        this.client.on("ready", () => {
            new ReadyEvent(this.client, "ready", true).execute();
        });
        this.client.on("messageUpdate", () => {
            new MessageUpdateEvent(this.client, "messageUpdate", false).execute();
        });
    }

}