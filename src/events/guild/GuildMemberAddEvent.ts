import {IEvent} from "../../structs/IEvent";
import {Client, ClientEvents, GuildMember} from "discord.js";
import BaseConfig from "../../base/BaseConfig";
import EmbedUtil from "../../utils/EmbedUtil";

export default class GuildMemberAddEvent implements IEvent {

    public name: keyof ClientEvents;
    public once: boolean;
    public client: Client;

    constructor(client: Client, name: keyof ClientEvents, once: boolean) {
        this.client = client;
        this.once = once;
        this.name = name;
    }

    public async execute(member: GuildMember) {
        if (member.guild.id === BaseConfig.get("GUILD-ID")) {
            await EmbedUtil.sendServerWelcomeMessage(member);
        }
    }

}