import Redis from '@ioc:Adonis/Addons/Redis'

export default async function () {
  // fetch the sorted scores in descending order
  const leaderboardRaw = await Redis.zrevrange('scores', 0, -1, 'WITHSCORES')

  let leaderboard: { id: string; name: string; score: string }[] = new Array(
    leaderboardRaw.length / 2
  )

  for (let i = 0; i < leaderboardRaw.length; i += 2) {
    const cachedUser = await Redis.hmget(leaderboardRaw[i], 'id', 'name')
    leaderboard[i / 2] = {
      id: cachedUser[0] + '',
      name: cachedUser[1] + '',
      score: leaderboardRaw[i + 1],
    }
  }

  return leaderboard
}
