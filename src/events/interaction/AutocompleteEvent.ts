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

import {IEvent} from "../../interfaces/IEvent";
import {Client, ClientEvents, Interaction} from "discord.js";
import TagUtil from "../../utils/database/TagUtil";

export default class AutocompleteEvent implements IEvent {

    public name: keyof ClientEvents;
    public once: boolean;
    public client: Client;

    constructor(client: Client, name: keyof ClientEvents, once: boolean) {
        this.client = client;
        this.once = once;
        this.name = name;
    }

    public async execute(interaction: Interaction) {
        if (!interaction.isAutocomplete()) return;
        switch (interaction.commandName) {
            case "tag":
                switch (interaction.options.getSubcommand()) {
                    case "get":
                    case "search":
                    case "edit":
                    case "delete":
                        const similarResults = [];
                        const focusedValue = interaction.options.getFocused() as string;
                        await TagUtil.findSimilarTags(focusedValue)
                            .then(async result => {
                                result.map(obj => {
                                    similarResults.push(obj.tag);
                                });
                            });
                        const filtered = similarResults.filter(choice => choice.startsWith(focusedValue)).slice(0, 5);
                        return void await interaction.respond(filtered.map(choice => ({name: "🔹 " + choice, value: choice})));
                }
        }
    }
}