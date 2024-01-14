import { REST, Routes } from "discord.js";

export const register = (command_list: any) => {
    const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

    (async () => {
        try {
            console.log(`Started refreshing ${command_list.length} application (/) commands.`);

            // The put method is used to fully refresh all commands in the guild with the current set
            const data: any = await rest.put(
                Routes.applicationCommands(process.env.APP_ID!),
                { body: command_list },
            );

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    })();
}