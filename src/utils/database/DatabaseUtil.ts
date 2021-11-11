import * as mongoose from "mongoose";
import BaseLogger from "../../base/BaseLogger";

export default class DatabaseUtil {

    public static async connectToDatabase(): Promise<void> {
        mongoose.connect(process.env["MONGO-URI"], {
            // @ts-ignore
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        BaseLogger.info("Connected to database.");
    }

}