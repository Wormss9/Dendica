import { PermissionFlagsBits, SlashCommandBuilder, ChatInputCommandInteraction, ChannelType, GuildMember, VoiceChannel } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('wake')
        .setDescription('Wakes up user.')
        .addUserOption(option =>
            option
                .setName('sleeper')
                .setDescription('The member to wake up')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const member = interaction.options.getMember('target') as GuildMember
        const original_channel = member.voice.channel as VoiceChannel

        if (!original_channel) {
            await interaction.editReply(`${member} is not in the call!`);
            return
        }

        const channels = await interaction.guild?.channels.fetch()
        const availible_channels = channels?.filter((channel) =>
            channel?.type === ChannelType.GuildVoice &&
            channel?.permissionsFor(member).has(PermissionFlagsBits.Connect) &&
            channel.id !== original_channel.id
        ).map((channel) => channel as VoiceChannel)

        if (!availible_channels || availible_channels.length < 1) {
            await interaction.editReply(`Nowhere to move`);
            return
        }

        for (let i = 0; i < 5; i++) {
            let random = Math.floor(Math.random() * availible_channels.length)
            await member.voice.setChannel(availible_channels[random]!)
            await member.voice.setChannel(original_channel)
        }
        await interaction.editReply(`${member} has been awoken!`);
    },
};