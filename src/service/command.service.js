import emojiService from './emojis.service'
import * as repository from '../repository/checkouter.repository'

const EMOJIS = emojiService(client)
export const register = async msg => {
    try {
        await repository.create({
            name: msg.member.displayName,
            discordId: msg.member.id,
        })
        msg.reply('cadastrado(a) com sucesso!!')
    } catch (error) {
        msg.reply('Deu ruim na hora de cadastrar o usuário!')
    }
}

export const luckyTega = async msg => {
    const checkouters = await repository.find()
    const totalTegas = checkouters.reduce(
        (acc, curr) => acc + curr.tegaCount,
        0
    )
    const checkoutersTotal = checkouters.length
    const averageTegas = totalTegas / checkoutersTotal

    const messagingCheckouter = checkouters.find(
        cktr => cktr.discordId === msg.member.id
    )
    const messagingCheckouterTegaCount =
        messagingCheckouter.tegaCount > 0 ? messagingCheckouter.tegaCount : 1

    const LUCKY_BALANCER = averageTegas / messagingCheckouterTegaCount

    const LUCKY_NUMBER = Math.random() * 100
    const CHANCE = 5 * LUCKY_BALANCER
    const RARE_CASE = 0.01 * LUCKY_BALANCER

    if (msg.content.includes('qual minha tegaChance?')) {
        msg.reply(`Sua chance é de ${CHANCE.toFixed(3)}% ${EMOJIS.stonks()}`)
    }

    // por faovr, se você ver esse código, não espalhe que tem esse caso especial com chance de 0.01%
    // no dia que sair todos vamos rir bastante e comemorar :) prometo folga pra quem tirar...
    if (LUCKY_NUMBER <= RARE_CASE) {
        try {
            const checkouter = await repository.findOneAndUpdate(msg.member.id)

            msg.reply(
                `Sei que é difícil de acreditar, mas sua mensagem foi premiada com o FRUTO PROIBIDO do COSTÃO!\n\nAgora vc tem ${
                    checkouter.tegaCount
                } TEGAS!\n\nSão 10 tegas a mais em uma porcentagem de ${RARE_CASE.toFixed(
                    4
                )}%\n\nQUE BRABX!!!`
            )
        } catch (error) {
            console.log('Error on adding lucky tega.', error)
        }
    } else if (LUCKY_NUMBER <= CHANCE) {
        try {
            const checkouter = await repository.findOneAndUpdate(msg.member.id)

            msg.reply(
                `sua mensagem foi premiada com o tega da sorte! Agora vc tem ${checkouter.tegaCount} TEGAS!`
            )
        } catch (error) {
            console.log('Error on adding lucky tega.', error)
        }
    } else if (LUCKY_NUMBER <= 5) {
        msg.reply(
            `Você QUASE foi premiada com o tega da sorte!\n\nsua chance é de ${CHANCE.toFixed(
                2
            )}% e o numero sorteado foi ${LUCKY_NUMBER.toFixed(
                3
            )}\n\n ${EMOJIS.enojado()}`
        )
    } else if (LUCKY_NUMBER <= 10) {
        msg.reply(
            `Ta sentindo o cheirinho?? tem ganhador chegando aqui!\n\nsua chance é de ${CHANCE.toFixed(
                2
            )}% e o numero sorteado foi ${LUCKY_NUMBER.toFixed(
                3
            )}\n\nIsso significa que o ganhador não foi você ${EMOJIS.genio()}`
        )
    }
}

export const rankTega = async msg => {
    try {
        const rank = await repository.findAll().sort({ tegaCount: -1 })
        const rankMsg = rank.reduce((acc, checkouter, index) => {
            return (
                acc +
                `\n ${index + 1}˚ ${checkouter.name} - Tegas: ${
                    checkouter.tegaCount
                }`
            )
        }, '')
        msg.reply(rankMsg)
    } catch (error) {
        msg.reply('Deu ruim na hora de cadastrar o usuário!')
    }
},
