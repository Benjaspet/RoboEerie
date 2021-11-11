export default class BaseLogger {

    public static info(message: string) {
        console.log(`[RoboEerie] [INFO] ${message}`);
    }

    public static warn(message: string): void {
        console.log(`[RoboEerie] [WARNING] ${message}`)
    }

    public static error(message: string): void {
        console.log(`[RoboEerie] [ERROR] ${message}`)
    }
}