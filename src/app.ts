import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
} from 'discord-interactions';
import { VerifyDiscordRequest } from './utils.js';
import {wake} from './commands/wake.js'

const app = express();
const PORT = process.env.PORT || 2024;
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY!) }));

app.post('/interactions', async function (req, res) {
  const { type, id, data } = req.body;

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
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
