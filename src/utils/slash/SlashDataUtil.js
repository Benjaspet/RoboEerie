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
            }];
    }
}