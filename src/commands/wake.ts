import { InteractionResponseType } from "discord-interactions";
import { Response } from "express";

export const wake = (res: Response) => {
    console.log(res)
    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: 'hello world ',
        },
    });
}