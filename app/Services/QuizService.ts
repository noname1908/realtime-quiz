import Redis from '@ioc:Adonis/Addons/Redis'
import transmit from '@ioc:Adonis/Addons/Transmit'
import Score from 'App/Models/Score'
import fetchLeaderboard from 'App/UseCases/FetchLeaderboard'

export default class QuizService {
  public async submit(payload: Partial<Score>): Promise<Score> {
    // get the exist user score in Redis
    const cachedScore = await Redis.zscore('scores', payload.userId!)
    if (!cachedScore) {
      throw new Error('User not found by provided id')
    }

    // save score to main database
    const dbScore = await Score.create(payload)

    // save new score to Redis sorted set
    await Redis.zadd('scores', payload.score! + parseInt(cachedScore, 10), payload.userId!)

    // fetch the updated leaderboard
    const leaderboard = await fetchLeaderboard()
    // then sent leaderboard event to the client
    transmit.broadcast('leaderboard', { leaderboard })

    return dbScore
  }
}
