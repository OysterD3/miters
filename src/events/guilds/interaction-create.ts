import {
  BaseInteraction,
  ChatInputCommandInteraction,
  Client,
  Events,
} from "discord.js";
import { BotEvent } from "../../types/utils";

const searchSlashCommand = (client: Client, interaction: BaseInteraction) => {
  if (!interaction.isCommand() || !interaction.isChatInputCommand())
    return null;
  const { commandName } = interaction;
  const subcommandGroupName = interaction.options.getSubcommandGroup();
  const subcommandName = interaction.options.getSubcommand(false);
  const searchCommandName = [commandName, subcommandGroupName, subcommandName]
    .filter((name) => name)
    .join(" ");
  console.log(searchCommandName);
  return client.slashCommands.get(searchCommandName);
};

const replyError = async (interaction: ChatInputCommandInteraction) => {
  if (interaction.replied || interaction.deferred) {
    await interaction.followUp({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  } else {
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
};

export default {
  eventName: Events.InteractionCreate,
  once: false,
  execute: async (client, interaction: BaseInteraction) => {
    if (!interaction.guild) return;

    if (interaction.isChatInputCommand()) {
      const command = searchSlashCommand(client, interaction);
      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`,
        );
        return;
      }

      try {
        await command.execute(client, interaction);
      } catch (error) {
        console.error(error);
        await replyError(interaction);
      }
    }
  },
} as BotEvent;
