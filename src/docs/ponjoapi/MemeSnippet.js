export class MemeSnippet {

    static getEndpointSnippet() {

        return "```" +
            "https://api.ponjo.club/v2/memes?key=apiKey&category=dank"
            + "```"
    }

    static getEndpointResponseSnippet() {

        const object = {
            upvotes: 12,
            likes: 15,
            category: {
                dank: {
                    url: "https://reddit.com/dankmemes"
                }
            }
        }

        const string = JSON.stringify(object, null, 4);

        return "```js\n" + `${string}` + "\n```";

    }
}