import { PermissionFlagsBits, SlashCommandBuilder, CommandInteraction, ChannelType, GuildMember, VoiceBasedChannel } from 'discord.js';

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
    async execute(interaction: CommandInteraction) {
        let channels = await interaction.guild?.channels.fetch()
        let member = interaction.options.getMember('target') as GuildMember
        let voice_channels = channels?.filter((channel) =>
            channel?.type === ChannelType.GuildVoice
        ).filter((channel) =>
            channel?.permissionsFor(member).has(PermissionFlagsBits.Connect)
        ).map((channel) => channel as VoiceBasedChannel)
        let channels_array = [...voice_channels!]
        if ((channels_array.length - 1) < 2) {
            await interaction.reply(`Nowhere to move`);
            return
        }
        console.log(member.voice.channel)
        let original_channel = member.voice.channel
        if (!original_channel) {
            await interaction.reply(`${member} is not in the call!`);
            return
        }
        let current_channel = original_channel;


        for (let i = 0; i < 5; i++) {
            let random
            while (true) {
                random = Math.floor(Math.random() * (channels_array.length - 1))
                if (channels_array[random] !== current_channel) {
                    break
                }
            }
            current_channel = channels_array[random]
            member.voice.setChannel(current_channel)
            member.voice.setChannel(original_channel)
        }
        await interaction.reply(`${member} has been awoken!`);
    },
};