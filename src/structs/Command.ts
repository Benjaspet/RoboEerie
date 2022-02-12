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

import {ApplicationCommand} from "../types/ApplicationCommand";
import {ApplicationCommandData, CommandInteraction} from "discord.js";

export default abstract class Command implements ApplicationCommand {

    protected name: string;
    protected data: ApplicationCommandData;

    protected constructor(name: string, data: ApplicationCommandData) {
        this.name = name;
        this.data = data;
    }

    /**
     * Run the slash command.
     * @param event The CommandInteraction object.
     * @return Promise<void>
     */

    abstract execute(event: CommandInteraction): Promise<void>;

    /**
     * Get the slash command data for this command.
     * @return ApplicationCommandData
     */

    abstract getCommandData(): ApplicationCommandData;

    /**
     * The name of this command.
     * @return string
     */

    abstract getName(): string;

}