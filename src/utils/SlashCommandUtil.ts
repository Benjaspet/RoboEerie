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
import AvatarCommand from "../commands/AvatarCommand";
import BanCommand from "../commands/BanCommand";
import GitHubCommand from "../commands/GitHubCommand";
import KickCommand from "../commands/KickCommand";
import MemeCommand from "../commands/MemeCommand";
import NPMCommand from "../commands/NPMCommand";
import PingCommand from "../commands/PingCommand";
import PlayerInfoCommand from "../commands/PlayerInfoCommand";
import PokemonCommand from "../commands/PokemonCommand";
import PollCommand from "../commands/PollCommand";
import QueryCommand from "../commands/QueryCommand";
import SendCommand from "../commands/SendCommand";
import StatsCommand from "../commands/StatsCommand";
import UrbanCommand from "../commands/UrbanCommand";
import BannerCommand from "../commands/BannerCommand";
import TagCommand from "../commands/TagCommand";
import ServerInfoCommand from "../commands/ServerInfoCommand";
import UserInfoCommand from "../commands/UserInfoCommand";
import UserInfoMenu from "../menu/UserInfoMenu";

export default class SlashCommandUtil {

    public static getAllSlashCommandData(client: Client): object[] {
        return [
            new AvatarCommand(client).getCommandData(),
            new BanCommand(client).getCommandData(),
            new BannerCommand(client).getCommandData(),
            new GitHubCommand(client).getCommandData(),
            new KickCommand(client).getCommandData(),
            new MemeCommand(client).getCommandData(),
            new NPMCommand(client).getCommandData(),
            new PingCommand(client).getCommandData(),
            new PlayerInfoCommand(client).getCommandData(),
            new PokemonCommand(client).getCommandData(),
            new PollCommand(client).getCommandData(),
            new QueryCommand(client).getCommandData(),
            new SendCommand(client).getCommandData(),
            new ServerInfoCommand(client).getCommandData(),
            new StatsCommand(client).getCommandData(),
            new TagCommand(client).getCommandData(),
            new UrbanCommand(client).getCommandData(),
            new UserInfoCommand(client).getCommandData(),
            new UserInfoMenu(client).getCommandData()
        ];
    }
}