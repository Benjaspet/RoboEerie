import {config} from "dotenv";

config();

export default class BaseConfig {

    public static get(value: string): any {
        return process.env[value];
    }

}