import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
} from 'discord.js';
import { VerifyDiscordRequest } from './utils.js';
import {wake} from './commands/wake.js'

const app = express();
const PORT = process.env.PORT || 2024;
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY!) }));

app.post('/interactions', async function (req, res) {
  const { type, id, data } = req.body;

  if (type === InteractionType.Ping) {
    return res.send({ type: InteractionResponseType.Pong });
  }

  if (type === InteractionType.ApplicationCommand) {
    switch (data.name) {
      case 'wake':
        await wake(res)
        break;
    }
  }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
