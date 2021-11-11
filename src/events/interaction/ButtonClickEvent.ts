import {Client, ClientEvents, GuildMember, Interaction} from "discord.js";
import BaseConfig from "../../base/BaseConfig";

export default class ButtonClickEvent {

    public name: keyof ClientEvents;
    public once: boolean;
    public client: Client;

    constructor(client: Client, name: keyof ClientEvents, once: boolean) {
        this.client = client;
        this.once = once;
        this.name = name;
    }

    public async execute(interaction: Interaction) {
        if (!interaction.isButton()) return;
        if (interaction.customId === "verify") {
            const member = <GuildMember> interaction.member;
            const roleId = BaseConfig.get("VERIFICATION-ROLE");
            const role = member.roles.cache.get(roleId);
            if (member.roles.cache.has(roleId)) {
                return await interaction.reply({content: "You're already verified!", ephemeral: true});
            } else {
                await member.roles.add(role);
                return await interaction.reply({content: "You've verified yourself successfully.", ephemeral: true});
            }
        }
    }
}