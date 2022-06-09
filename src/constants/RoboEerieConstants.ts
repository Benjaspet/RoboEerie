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

import Config from "../structs/Config";
import {ColorResolvable} from "discord.js";

export default class RoboEerieConstants {

    public static TOKEN: string = Config.get("TOKEN");
    public static MONGO_URI: string = Config.get("MONGO-URI");
    public static CLIENT_ID: string = Config.get("CLIENT-ID");
    public static DEFAULT_EMBED_COLOR: ColorResolvable = Config.get("DEFAULT-EMBED-COLOR");

    public static EMOJI_SUCCESS: string = Config.get("EMOJI-SUCCESS");
    public static EMOJI_ERROR: string = Config.get("EMOJI-ERROR");
    public static EMOJI_LOADING: string = Config.get("EMOJI-LOADING");

}