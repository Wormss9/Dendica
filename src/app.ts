import commands from './commands/index.js';
import { Collection, Client, Events, GatewayIntentBits } from 'discord.js';
import { register } from './register.js';
import { DISCORD_TOKEN } from './env.js';

interface ClientWithCommands extends Client {
  commands: Collection<string, any>
}

let command_list = [];
const client = new Client({ intents: [GatewayIntentBits.Guilds] }) as ClientWithCommands;

client.once(Events.ClientReady, readyClient => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.commands = new Collection();

for (const command of commands) {
  client.commands.set(command.data.name, command);
  command_list.push(command.data.toJSON())
}

client.login(DISCORD_TOKEN);

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = (interaction.client as ClientWithCommands).commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

register(command_list)
