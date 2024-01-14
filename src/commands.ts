import 'dotenv/config';
import { InstallGlobalCommands } from './utils.js';

export type Command = {
  name: string,
  description: string,
  type: number,
  required?: boolean
  options?: Command[]
};

const WAKE_COMMAND: Command = {
  name: 'wake',
  description: 'Wakes a user up',
  type: 1,
  options: [
    {
      name: "user",
      description: "The user to get",
      type: 6,
      required: true
    }]
};

const ALL_COMMANDS = [WAKE_COMMAND];

InstallGlobalCommands(process.env.APP_ID!, ALL_COMMANDS);