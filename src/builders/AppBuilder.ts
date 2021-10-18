import config from "../resources/Config";
import {Client} from "discord.js";
import PonjoBuilder from "./PonjoBuilder";
import * as environment from "dotenv";

environment.config();

export default class AppBuilder extends PonjoBuilder {

    constructor(client: Client) {
        super();
        console.clear();
        client.login(process.env.TOKEN).then(() => {});
    }

}