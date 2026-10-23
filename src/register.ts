import { REST, Routes, type RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js";

export const register = (command_list: RESTPostAPIChatInputApplicationCommandsJSONBody[]) => {
    const rest = new REST().setToken(Bun.env.DISCORD_TOKEN!);

    (async () => {
        try {
            console.log(`Started refreshing ${command_list.length} application (/) commands.`);

            const data: any = await rest.put(
                Routes.applicationCommands(Bun.env.APP_ID!),
                { body: command_list },
            );

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            console.error(error);
        }
    })();
}