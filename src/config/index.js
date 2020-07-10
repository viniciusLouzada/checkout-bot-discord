import startDb from './config/db.config'
import startCrons from './config/db.config'

export default async client => {
    startDb()
    await startCrons(client)
}
