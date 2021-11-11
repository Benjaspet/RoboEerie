export interface ICommand {
    name: string,
    once: boolean,
    enabled: boolean,
    description: string,
    aliases?: string[],
    slashData: object
}