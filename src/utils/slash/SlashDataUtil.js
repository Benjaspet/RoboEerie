export default class SlashDataUtil {

    static getAllPonjoSlashCommandData() {

        return [

            {
                name: "deploy",
                description: "Set all slash commands to the Ponjo Development guild.",

            },
            {
                name: "poll",
                description: "Create a poll for the guild.",
                options: [
                    {
                        name: "channel",
                        description: "The channel to send the poll in.",
                        type: "CHANNEL",
                        required: true,
                    },
                    {
                        name: "description",
                        description: "The context/description of the poll.",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "github",
                description: "View information on a user's GitHub account.",
                options: [
                    {
                        name: "user",
                        description: "The GitHub username to search for.",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "docs",
                description: "View documentation for the specified app or library.",
                options: [
                    {
                        name: "library",
                        description: "The library you'd like to view the documentation of.",
                        type: "STRING",
                        required: true,
                        choices: [
                            {
                                name: "Discord.js v13",
                                value: "djs-v13"
                            },
                            {
                                name: "Ponjo API",
                                value: "ponjo-api"
                            }
                        ]
                    },
                    {
                        name: "query",
                        description: "The query to search the documentation for.",
                        type: "STRING",
                        required: true
                    }
                ]
            },
            {
                name: "avatar",
                description: "Display the avatar of the specified user.",
                options: [
                    {
                        name: "user",
                        description: "The user whose avatar you'd like to view.",
                        type: "USER",
                        required: true
                    }
                ]
            },
            {
                name: "query",
                description: "Query a game server of your choice.",
                options: [
                    {
                        name: "game",
                        description: "The type of game server you'd like to query.",
                        type: "STRING",
                        required: true,
                        choices: [
                            {
                                name: "Minecraft: Bedrock",
                                value: "minecraftbe"
                            },
                            {
                                name: "Minecraft: Java",
                                value: "minecraft"
                            }
                        ]
                    },
                    {
                        name: "host",
                        description: "The IP address of the host to query.",
                        type: "STRING",
                        required: true
                    },
                    {
                        name: "port",
                        description: "The port of the host to query.",
                        type: "STRING",
                        required: true
                    }
                ]
            }];
    }
}