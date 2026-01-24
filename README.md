# barnacle

A Discord bot built with [Carbon](https://carbon.buape.com).

## Setup

1. Create a `.env` file with the following variables:
```env
BASE_URL="your-base-url"
DEPLOY_SECRET="your-deploy-secret"
DISCORD_CLIENT_ID="your-client-id"
DISCORD_PUBLIC_KEY="discord-public-key"
DISCORD_BOT_TOKEN="your-bot-token"
```

2. Install dependencies:
```bash
bun install
```

3. Start the development server:
```bash
bun run dev
```

## Commands

- `/github` - Look up an issue or PR (defaults to clawdbot/clawdbot)

## Gateway Events

The bot listens for the following Gateway events:
- AutoModeration Action Execution - Sends keyword-based responses

## AutoMod Responses

Edit `src/config/automod-messages.json` to map keywords to messages. Use `{user}` to mention the triggering user.

## License

MIT