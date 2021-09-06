import config from "../resources/Config";
import {Client} from "discord.js";

export default class AppBuilder {

    constructor(client: Client) {
        console.clear();
        client.login(config.token).then(() => {});
    }
}