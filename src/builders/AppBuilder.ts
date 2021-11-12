import {Client} from "discord.js";
import BaseConfig from "../base/BaseConfig";
import Util from "../utils/Util";

export default class AppBuilder {

    private client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public login(): void {
        Util.clearConsole();
        this.client.login(BaseConfig.get("TOKEN")).then(() => {});
    }
}