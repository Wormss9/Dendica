use rand::seq::IndexedRandom;
use serenity::all::{
    ChannelType, CommandInteraction, CommandOptionType, Context, CreateCommand,
    CreateCommandOption, Permissions, ResolvedValue,
};

pub fn register() -> CreateCommand {
    CreateCommand::new("wake")
        .description("Wakes up user.")
        .add_option(
            CreateCommandOption::new(CommandOptionType::User, "sleeper", "The member to wake up")
                .required(true),
        )
        .default_member_permissions(Permissions::MOVE_MEMBERS)
}

pub async fn run(ctx: &Context, command: &CommandInteraction) -> Result<String, String> {
    let user_id = match command
        .data
        .options()
        .into_iter()
        .find(|option| option.name == "sleeper")
        .map(|option| option.value)
    {
        Some(ResolvedValue::User(user, _)) => user.id,
        _ => return Err("User missing from request!".to_string()),
    };

    let guild_id = match command.guild_id {
        Some(id) => id,
        None => return Err("Server missing from request!".to_string()),
    };

    let (original_channel_id, available_channels) = {
        let guild = match ctx.cache.guild(guild_id) {
            Some(guild) => guild,
            None => return Err("Could not find the server in the cache.".to_string()),
        };

        let member = match guild.members.get(&user_id) {
            Some(member) => member,
            None => return Err("Could not find the member in cache.".to_string()),
        };

        let voice_state = match guild.voice_states.get(&user_id) {
            Some(state) => state,
            None => return Ok(format!("<@{user_id}> is not in the call!")),
        };

        let original_channel_id = match voice_state.channel_id {
            Some(id) => id,
            None => return Ok(format!("<@{user_id}> is not in the call!")),
        };

        let available_channels: Vec<_> = guild
            .channels
            .values()
            .filter(|channel| {
                channel.kind == ChannelType::Voice && channel.id != original_channel_id
            })
            .filter(|channel| {
                guild
                    .user_permissions_in(channel, member)
                    .contains(Permissions::CONNECT)
            })
            .map(|channel| channel.id)
            .collect();

        (original_channel_id, available_channels)
    };

    if available_channels.is_empty() {
        return Ok("Nowhere to move!".to_string());
    }

    for _ in 0..5 {
        let new_channel_id = { available_channels.choose(&mut rand::rng()).copied() };

        let new_channel_id = match new_channel_id {
            Some(id) => id,
            None => return Ok("Nowhere to move!".to_string()),
        };

        if let Err(error) = guild_id
            .move_member(&ctx.http, user_id, new_channel_id)
            .await
        {
            return Err(format!("Failed to move user: {error}"));
        }

        if let Err(error) = guild_id
            .move_member(&ctx.http, user_id, original_channel_id)
            .await
        {
            return Err(format!("Failed to move user back: {error}"));
        }
    }

    Ok(format!("<@{user_id}> has been awoken!"))
}
