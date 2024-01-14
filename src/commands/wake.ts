import { InteractionResponseType, Client, GatewayIntentBits } from "discord.js";
import { Response } from "express";

export const wake = async (res: Response) => {
    const client = new Client({ intents: [16777216] });

    let x = await client.fetchGuildPreview

    console.log("x")
    console.log(x)

    let member = res.req.body.data.resolved.members
    console.log(member)
    let id = Object.keys(member)
    console.log(id)

    return res.send({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            content: 'hello world ',
        },
    });
}