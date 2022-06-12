/*
 * Copyright © 2022 Ben Petrillo. All rights reserved.
 *
 * Project licensed under the MIT License: https://www.mit.edu/~amini/LICENSE.md
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * All portions of this software are available for public use, provided that
 * credit is given to the original author(s).
 */

import {Client} from "discord.js";
import AutocompleteEvent from "../events/interaction/AutocompleteEvent";
import UserInfoMenu from "../menu/UserInfoMenu";
import ReadyEvent from "../events/client/ReadyEvent";
import InteractionEvent from "../events/interaction/InteractionEvent";
import MessageEvent from "../events/message/MessageEvent";

export default class EventManager {

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
            .on("interactionCreate", async interaction => {
                if (interaction.isCommand()) {
                    await new InteractionEvent(this.client, "interactionCreate", false).execute(interaction);
                } else if (interaction.isAutocomplete()) {
                    await new AutocompleteEvent(this.client, "interactionCreate", false).execute(interaction);
                } else if (interaction.isContextMenu()) {
                    await new UserInfoMenu(this.client).execute(interaction);
                }
            })
            .on("messageCreate", async message => {
               if (message.channel.isText() && message.channel.type !== "DM") {
                   await new MessageEvent(this.client, "messageCreate", false).execute(message);
               }
            });
    }
}