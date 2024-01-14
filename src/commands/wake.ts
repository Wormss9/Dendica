import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('wake')
        .setDescription('Wakes up user.')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The member to wake up')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers),
    async execute(interaction: any) {
        await interaction.reply('hello world');
    },
};