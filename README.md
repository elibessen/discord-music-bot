# Discord music bot
🎶 A Discord music bot with simple commands and easy to run yourself.

## Commands
---
- `/play (song, playlist, search)`
- `/queue`
- `/shuffle`
- `/skip`
- `/exit`
- `/nowplaying`
- `/help`
- `/ping`

## Supported sources and formats
___
#### Sources
- YouTube
- Spotify (Coming soon)
- SoundCloud (Coming soon)

#### Formats
- mp3

## Setup
___
This bot uses [ffmpeg](https://ffmpeg.org/) to handle the audio streams. A good installation tutorial is [here](https://www.youtube.com/watch?v=IECI72XEox0&t).



Install all dependencies
```
npm i
```
Create a `.env` file in the root directory
```
TOKEN=[BOT TOKEN]
CLIENT_ID=[CLIENT ID]
```
Register slash commands on all Discord servers
```
npm run update
```
Run the bot
```
npm run launch
```

# License

[MIT](https://github.com/elibessen/discord-music-bot/blob/main/LICENSE)
