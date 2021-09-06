import config from "../resources/Config";
import {Client} from "discord.js";
import PonjoBuilder from "./PonjoBuilder";

export default class AppBuilder extends PonjoBuilder {

    constructor(client: Client) {
        super();
        console.clear();
        client.login(config.token).then(() => {});
    }

}