import Checkouter from '../model/checkouter'

export const findAll = () => Checkouter.find()

export const findOneAndUpdate = discordId =>
    Checkouter.findOneAndUpdate(
        { discordId },
        { $inc: { tegaCount: 1 } },
        { new: true }
    )

export const create = ({ name, discordId }) =>
    Checkouter.create({
        name,
        discordId,
    })
