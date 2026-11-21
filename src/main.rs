mod commands;

use serenity::{
    Client,
    all::{
        Command, Context, CreateInteractionResponseFollowup, EditInteractionResponse, EventHandler,
        GatewayIntents, Interaction, Ready,
    },
    async_trait,
    prelude::SerenityError,
};
use std::env;

struct Handler;

#[async_trait]
impl EventHandler for Handler {
    async fn interaction_create(&self, ctx: Context, interaction: Interaction) {
        let Interaction::Command(command) = interaction else {
            eprintln!("Interaction has no command!");
            return;
        };

        if let Err(error) = command.defer(&ctx.http).await {
            eprintln!("Failed to defer interaction: {error}");
            return;
        }

        let result = match command.data.name.as_str() {
            "wake" => commands::wake::run(&ctx, &command).await,
            name => Ok(format!("Command {name} is not implemented!")),
        };

        match result {
            Ok(content) => {
                if let Err(error) = command
                    .edit_response(&ctx.http, EditInteractionResponse::new().content(content))
                    .await
                {
                    eprintln!("Failed to edit interaction response: {error}");
                }
            }

            Err(error) => {
                eprintln!("Command execution error: {error}");

                if let Err(delete_error) = command.delete_response(&ctx.http).await {
                    eprintln!("Failed to delete deferred response: {delete_error}");
                }

                if let Err(followup_error) = command
                    .create_followup(
                        &ctx.http,
                        CreateInteractionResponseFollowup::new()
                            .content("There was an error while executing this command!")
                            .ephemeral(true),
                    )
                    .await
                {
                    eprintln!("Failed to send error follow-up: {followup_error}");
                }
            }
        }
    }

    async fn ready(&self, ctx: Context, ready: Ready) {
        println!("{}#{} is connected!", ready.user.name, ready.user.id);

        let global_commands: Result<Vec<Command>, SerenityError> =
            Command::set_global_commands(&ctx.http, vec![commands::wake::register()]).await;

        match global_commands {
            Ok(commands) => {
                println!("Successfully registered {} commands:", commands.len());

                for command in commands {
                    print!(" {}", command.name);
                }
            }
            Err(error) => eprintln!("Command registering error: {error:?}"),
        }
    }
}

#[tokio::main]
async fn main() {
    dotenvy::dotenv().expect("Failed to load .env file.");

    let token = env::var("DISCORD_TOKEN").expect("Expected a token in the environment");
    let intents = GatewayIntents::GUILDS | GatewayIntents::GUILD_VOICE_STATES;

    let mut client = Client::builder(&token, intents)
        .event_handler(Handler)
        .await
        .expect("Client creation client");

    if let Err(error) = client.start().await {
        eprintln!("Client start error: {error:?}");
    }
}
