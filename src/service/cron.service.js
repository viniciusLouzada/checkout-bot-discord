import cron from 'node-cron'
import * as checkouterService from './checkouter.service'
import emojiService from './emojis.service'
import roleService from './role.service'

const EMOJIS = emojiService(client)

const createCron = (scheduled, cronFn) =>
    cron.schedule(scheduled, cronFn, {
        scheduled: true,
        timezone: 'America/Sao_Paulo',
    })

export const luckyTega = channel =>
    createCron('0 10-19 * * 1-5', async () => {
        const luckyCheckouter = await checkouterService.luckyTega(channel)
        channel.send(
            `<@${luckyCheckouter.discordId}> recebeu um TEGA da sorte aleatório, parabéns!!`
        )
    })

export const pulses = channel =>
    createCron('* 10-19 * * 1', () =>
        channel.send(
            `<@&${roleService.checkouter}> Já respondeu o seu pulses hoje? https://www.pulses.com.br/app/engage/`
        )
    )

export const daily = channel =>
    createCron('0 15 * * 1-5', () =>
        channel.send(`<@&${roleService.checkouter}> Partiu daily!!`)
    )

export const fourTwenty = channel =>
    createCron('20 16 * * 1-5', () =>
        channel.send(
            `<@&${roleService.checkouter}> 4:20, hora do café do Thiagão!`
        )
    )

export const tegaAnswer = channel =>
    createCron('*/15 10-19 * * 1-5', async () => {
        try {
            if (Math.round(Math.random() * 100) <= 10) {
                await channel.send(
                    'SORTEIO DE TEGA! - o primeiro a falar TEGA no chat irá ganha 1 tega!!! - VALENDOOOOO'
                )
                const collected = await channel.awaitMessages(
                    response => response.content === 'TEGA',
                    {
                        max: 1,
                        time: 90000,
                        errors: ['time'],
                    }
                )
                const { author } = collected.first()
                await checkouterService.tegaAnswer(author.id)
                channel.send(`${author} ganhou 1 TEGA! ${EMOJIS.dimba()}`)
            }
        } catch (error) {
            channel.send(`Deram mole, ninguém ganhou tega, ${EMOJIS.alberto()}`)
        }
    })
