import Tags from "../../schemas/TagSchema";

export default class TagUtil {

    public static async createTag(tag: string, content: string, author: string, guild: string) {
        return new Promise<any>(async (resolve, reject) => {
            await Tags.create({
                tag: tag,
                content: content,
                author: author,
                guild: guild
            }).then(async result => {
                if (!result) {
                    reject({
                        msg: "An error occurred in creating the tag."
                    });
                }
                resolve({
                    msg: "Tag created successfully."
                });
            }).catch(error => {
                reject({
                    msg: "An error occurred in creating the tag.",
                    error: error
                });
            });
        });
    }

    public static async tagExists(tag: string) {
        return new Promise<any>(async(resolve, reject) => {
            await TagUtil.searchGlobalTag(tag)
                .then(result => {
                    if (result) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }).catch(error => {resolve(false)});
        })
    }

    public static async findSimilarTags(tag: string) {
        const data = [];
        return new Promise<any>(async (resolve, reject) => {
            await Tags.find().then(async result => {
                    result.forEach(res => {
                        if (res.tag.includes(tag)) {
                            data.push(res);
                        }
                        resolve(data);
                    });
                })
               .catch(error => {
                   reject(error);
               })
        });
    }

    public static async searchGlobalTag(tag: string) {
        return new Promise<any>(async (resolve, reject) => {
           await Tags.findOne({tag: tag})
               .then(async result => {
                  if (!result) {
                      reject({
                          msg: "Tag not found.",
                      });
                  }
                  resolve({
                      tag: result.tag,
                      content: result.content,
                      author: result.author,
                      guild: result.guild
                  });
               }).catch(error => {
                   reject({
                       msg: "An error occurred in finding the tag.",
                       error: error
                   });
               });
        });
    }

    public static async editTag(tag: string, content: string) {
        return new Promise<any>(async (resolve, reject) => {
            await Tags.findOneAndUpdate({tag: tag}, {content: content})
                .then(async result => {
                    if (!result) {
                        reject({
                            msg: "Tag not found.",
                        });
                    }
                    resolve(result);
                }).catch(error => {
                    reject({
                        msg: "An error occurred in finding the tag.",
                        error: error
                    });
                });
        });
    }

    public static async deleteTag(tag: string) {
        return new Promise<any>(async (resolve, reject) => {
            await Tags.findOneAndDelete({tag: tag})
                .then(async result => {
                    if (!result) {
                        reject({
                            msg: "Tag not found.",
                        });
                    }
                    resolve(result);
                }).catch(error => {
                    reject({
                        msg: "An error occurred in finding the tag.",
                        error: error
                    });
                });
        });
    }
}