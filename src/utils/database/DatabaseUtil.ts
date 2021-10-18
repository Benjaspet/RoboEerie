import * as mongoose from "mongoose";

export default class DatabaseUtil {

    public static async connectToDatabase(): Promise<void> {
        mongoose.connect(process.env["MONGO-URI"], {
            // @ts-ignore
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✔ Connected to database.");
    }

}