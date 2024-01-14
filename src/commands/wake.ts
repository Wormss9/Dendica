import { InteractionResponseType, Client, GatewayIntentBits, ClientOptions } from "discord.js";
import { Response } from "express";

export const wake = async (res: Response) => {
    const client = new Client({ intents: [16777216] });
    client.login(process.env.DISCORD_TOKEN!)

    let guild = await client.fetchGuildPreview(res.req.body.guild_id)

    console.log(guild)


    let member = res.req.body.data.resolved.members
    let id = Object.keys(member)[0]
    console.log(id)

    return res.send({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            content: 'hello world ',
        },
    });
}