import * as mongoose from "mongoose";

const TagSchema = new mongoose.Schema(
    {
        id: String,
        tag: String,
        content: String,
        author: String,
        guild: String
    }, {
        timestamps: true,
        versionKey: false
    }
);

const Tags = mongoose.model("tags", TagSchema);
export default Tags;