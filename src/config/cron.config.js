import * as cronService from '../service/cron.service'
import channelService from '../service/channel.service'

export default async client => {
    const resenhaChannel = await client.channels.fetch(channelService.resenha)
    const planningChannel = await client.channels.fetch(channelService.planning)
    const bolsaChannel = await client.channels.fetch(channelService.bolsa)

    cronService.fourTwenty(resenhaChannel)
    cronService.pulses(resenhaChannel)
    cronService.daily(planningChannel)
    cronService.luckyTega(resenhaChannel)
    cronService.tegaAnswer(resenhaChannel)
}
