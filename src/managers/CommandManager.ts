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

import {Client, Collection } from "discord.js";
import {ApplicationCommand} from "../types/ApplicationCommand";
import AvatarCommand from "../commands/AvatarCommand";
import Command from "../structs/Command";
import BannerCommand from "../commands/BannerCommand";
import GitHubCommand from "../commands/GitHubCommand";
import MemeCommand from "../commands/MemeCommand";
import NPMCommand from "../commands/NPMCommand";
import PingCommand from "../commands/PingCommand";
import PokemonCommand from "../commands/PokemonCommand";
import PollCommand from "../commands/PollCommand";
import QueryCommand from "../commands/QueryCommand";
import SendCommand from "../commands/SendCommand";
import ServerInfoCommand from "../commands/ServerInfoCommand";
import StatsCommand from "../commands/StatsCommand";
import TagCommand from "../commands/TagCommand";
import UrbanCommand from "../commands/UrbanCommand";
import UserInfoCommand from "../commands/UserInfoCommand";
import ValorantCommand from "../commands/ValorantCommand";
import HaloInfiniteCommand from "../commands/HaloInfiniteCommand";

export default class CommandManager {

    public static commands: Collection<string, ApplicationCommand> = new Collection<string, ApplicationCommand>();
    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
        CommandManager.registerCommands([
            new AvatarCommand(client),
            new BannerCommand(client),
            new GitHubCommand(client),
            new HaloInfiniteCommand(client),
            new MemeCommand(client),
            new NPMCommand(client),
            new PingCommand(client),
            new PokemonCommand(client),
            new PollCommand(client),
            new QueryCommand(client),
            new SendCommand(client),
            new ServerInfoCommand(client),
            new StatsCommand(client),
            new TagCommand(client),
            new UrbanCommand(client),
            new UserInfoCommand(client),
            new ValorantCommand(client),
        ]);
    }

    private static registerCommands(commands: Command[]): void {
        for (const command of commands) {
            CommandManager.commands.set(command.getName(), command);
        }
    }
}