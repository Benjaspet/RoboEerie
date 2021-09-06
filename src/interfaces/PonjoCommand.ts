export interface PonjoCommand {
    name: string,
    once: boolean,
    enabled: boolean,
    description: string,
    aliases?: string[],
    slashData: object
}