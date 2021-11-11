import {Client} from "discord.js";
import ReadyEvent from "../events/client/ReadyEvent";
import MessageUpdateEvent from "../events/message/MessageUpdateEvent";
import MessageCreateEvent from "../events/message/MessageCreateEvent";
import GuildMemberAddEvent from "../events/guild/GuildMemberAddEvent";
import CommandBuilder from "../builders/CommandBuilder";
import AutocompleteEvent from "../events/interaction/AutocompleteEvent";
import ButtonClickEvent from "../events/interaction/ButtonClickEvent";
import UserInfoMenu from "../menu/UserInfoMenu";

export default class EventBase {

    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
        this.initAllEvents().then(() => {});
    }

    private async initAllEvents(): Promise<any> {

        this.client
            .on("ready", async () => {
                await new ReadyEvent(this.client, "ready", true).execute();
            })
            .on("messageCreate", async message => {
                await new MessageCreateEvent(this.client, "messageCreate", true).execute(message);
            })
            .on("messageUpdate", async (first, last) => {
                await new MessageUpdateEvent(this.client, "messageUpdate", false).execute(first, last);
            })
            .on("guildMemberAdd", async member => {
                await new GuildMemberAddEvent(this.client, "guildMemberAdd", false).execute(member);
            })
            .on("interactionCreate", async interaction => {
                if (interaction.isCommand()) {
                    await CommandBuilder.respondToApplicationCommands(this.client, interaction);
                } else if (interaction.isButton()) {
                    await new ButtonClickEvent(this.client, "interactionCreate", false).execute(interaction);
                } else if (interaction.isSelectMenu()) {}
                else if (interaction.isAutocomplete()) {
                    await new AutocompleteEvent(this.client, "interactionCreate", false).execute(interaction);
                } else if (interaction.isContextMenu()) {
                    await new UserInfoMenu(this.client).execute(interaction);
                }
                else if (interaction.isMessageComponent()) {}
            });
    }
}