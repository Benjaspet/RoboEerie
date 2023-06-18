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

import {Client, ClientEvents, Message,} from "discord.js";
import {IEvent} from "../../interfaces/IEvent";
import axios from "axios";
import Utilities from "../../utils/Utilities";
import Users from "../../schemas/UserSchema";

export default class MessageEvent implements IEvent {

    public name: keyof ClientEvents;
    public once: boolean;
    public readonly client: Client;

    constructor(client: Client, name: keyof ClientEvents, once: boolean) {
        this.name = name;
        this.once = once;
        this.client = client;
    }

    public async execute(message: Message): Promise<void> {
        if (message.inGuild()) {
            const userId: string = message.author.id;
            const guildId: string = message.guildId;
            await Users.findOne({userId: userId})
                .then(async result => {
                    if (result) {
                        const cachedGuilds: any = result.guilds; let found: boolean;
                        let cachedTotalMessages = result.totalMessages as number;
                        for (let i = 0; i < cachedGuilds.length; i++) {
                            if (cachedGuilds[i].guild === guildId) {
                                cachedGuilds[i].messages++;
                                cachedTotalMessages++;
                                if (Utilities.determineURLValidity(message.content)) {
                                    cachedGuilds[i].links++;
                                }
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            const data = await Users.findOne({userId: userId});
                            data.totalMessages = cachedTotalMessages;
                            data.guilds.push({
                                guild: guildId,
                                messages: 1,
                                links: 0,
                            });
                            data.save();
                        } else {
                            const data = await Users.findOne({userId: userId});
                            data.guilds = cachedGuilds;
                            data.totalMessages = cachedTotalMessages;
                            data.save();
                        }
                    } else {
                        await Users.create({
                            userId: userId,
                            totalMessages: 1,
                            guilds: [
                                {
                                    guild: guildId,
                                    messages: 1,
                                    links: 0
                                }
                            ]
                        });
                    }
                })
                .catch(() => {});
        }
    }
}