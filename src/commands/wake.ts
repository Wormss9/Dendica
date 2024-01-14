import { InteractionResponseType } from "discord-interactions";
import { Response } from "express";

export const wake = async (res: Response) => {
    console.log("body")
    console.log(res.req.body)
    console.log("data")
    console.log(res.req.body.data)
    console.log("resolved")
    console.log(res.req.body.data.resolved)
    let channels = await res.req.body.guild.channels.fetch()
    console.log(channels)
    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: 'hello world ',
        },
    });
}