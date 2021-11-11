import {Client} from "discord.js";
import PonjoBuilder from "./PonjoBuilder";
import * as environment from "dotenv";

environment.config();

export default class AppBuilder {

    private client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public login(): void {
        console.clear();
        this.client.login(process.env.TOKEN).then(() => {});
    }
}