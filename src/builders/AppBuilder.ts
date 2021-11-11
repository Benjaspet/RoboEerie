import {Client} from "discord.js";
import BaseConfig from "../base/BaseConfig";
import PonjoUtil from "../utils/PonjoUtil";

export default class AppBuilder {

    private client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public login(): void {
        PonjoUtil.clearConsole();
        this.client.login(BaseConfig.get("TOKEN")).then(() => {});
    }
}