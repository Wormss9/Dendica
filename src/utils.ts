import 'dotenv/config';
import fetch from 'node-fetch';
import { verifyKey } from 'discord-interactions';
import { Request, Response } from 'express';
import type { Command } from './commands.d.ts'

export function VerifyDiscordRequest(clientKey: string) {
  return function (req: Request, res: Response, buf: Buffer, encoding: any) {
    console.log("encoding")
    console.log(encoding)
    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');

    const isValidRequest = verifyKey(buf, signature!, timestamp!, clientKey);
    if (!isValidRequest) {
      res.status(401).send('Bad request signature');
      throw new Error('Bad request signature');
    }
  };
}

export async function DiscordRequest(endpoint: string, method: string, body: string) {
  const url = 'https://discord.com/api/v10/' + endpoint;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
    },
    method,
    body
  });

  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }

  return res;
}

export async function InstallGlobalCommands(appId: string, commands: Command[]) {
  const endpoint = `applications/${appId}/commands`;

  try {
    await DiscordRequest(endpoint, 'PUT', JSON.stringify(commands));
  } catch (err) {
    console.error(err);
  }
}
