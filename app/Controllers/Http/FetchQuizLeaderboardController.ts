import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import fetchLeaderboard from 'App/UseCases/FetchLeaderboard'

export default class FetchQuizLeaderboardController {
  /**
   * @handle
   * @operationId fetchQuizLeaderboard
   * @responseBody 200 - score data array
   */
  public async handle(_ctx: HttpContextContract) {
    const leaderboard = await fetchLeaderboard()

    return leaderboard
  }
}
