import * as repository from '../repository/checkouter.repository'

export const luckyTega = async () => {
    if (Math.round(Math.random() * 100) <= 30) {
        const checkouters = await repository.findAll()
        const checkoutersTotal = checkouters.length
        const luckyCheckouterIndex = Math.floor(
            Math.random() * checkoutersTotal
        )
        const { discordId } = checkouters[luckyCheckouterIndex]
        const luckyCheckouter = await repository.findOneAndUpdate(discordId)

        return luckyCheckouter
    }
}

export const tegaAnswer = discordId => repository.findOneAndUpdate(discordId)
