import { InteractionResponseType, Client, GatewayIntentBits } from "discord.js";
import { Response } from "express";

export const wake = async (res: Response) => {
    const client = new Client({ intents: [16777216] });

    console.log(res.req.body.data)

    // let x = await client.fetchGuildPreview()


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