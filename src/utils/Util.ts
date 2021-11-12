import {ColorResolvable} from "discord.js";

export default class Util {

    public static getDefaultEmbedColor(): ColorResolvable {
        return "#00e1ff";
    }

    public static sleep(ms): Promise<any> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public static clearConsole(): void {
        console.clear();
    }

    public static capitalize(string: string): string {
        let str = string.split(" ");
        for (let i = 0; i < str.length; i++) {
            const firstChar = str[i].charAt(0)
            str[i] = firstChar.toUpperCase() + str[i].substr(1)
        }
        return str.join(" ");
    }
}