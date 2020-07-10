import Discord from 'discord.js'
import DotEnv from 'dotenv'

import roleService from './service/role.service'
import * as commandService from './service/command.service'
import startConfigs from './config'

DotEnv.config()
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
const client = new Discord.Client()

client.on('ready', async () => {
    await startConfigs(client)
    console.log('Bot is running...')
})

client.on('message', async msg => {
    if (msg.content.includes('!cb')) {
        const code = msg.content.split(' ')[1]
        if (code === 'register') commandService.register(msg)
        if (code === 'tegaRank') commandService.tegaRank(msg)
    }

    if (msg.member.roles.cache.has(roleService.checkouter))
        commandService.luckyTega(msg)
})

client.login(DISCORD_BOT_TOKEN)
