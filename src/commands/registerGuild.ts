import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { createGuild, getGuildById } from '../database/services/DiscordGuildServices';
import commandWrapper from '../util/commandWrapper';
import CommandInterface from './types/CommandInterface';

const registerGuild: CommandInterface = {
  data: new SlashCommandBuilder()
    .setName('registerguild')
    .setDescription('Registers your server.')
    .addChannelOption((option) =>
      option
        .setName('pupper-channel')
        .setDescription('The channel where the bot will periodically post a rare pupper.')
        .setRequired(true),
    )
    .setDefaultMemberPermissions(0),
  execute: commandWrapper(async (interaction) => {
    const guild = await getGuildById(interaction.guildId!);
    if (guild) {
      await interaction.reply('Your guild is already registered!');
      return;
    }

    const pupperChannel = interaction.options.get('pupper-channel')!.value!.toString();
    const channel = pupperChannel.replace(/\D/g, '');

    const newGuild = await createGuild({
      guildId: interaction.guildId!,
      pupperChannelId: channel,
      name: interaction.guild!.name,
    });

    const embed = new EmbedBuilder().setTitle('Guild Registered!').addFields([
      { name: 'Guild Name', value: newGuild.name },
      { name: 'Pupper Channel', value: `<#${newGuild.pupperChannelId}>` },
    ]);

    await interaction.reply({ embeds: [embed] });
  }),
};

export default registerGuild;
