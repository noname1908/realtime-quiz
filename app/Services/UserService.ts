import Redis from '@ioc:Adonis/Addons/Redis'
import User from 'App/Models/User'

export default class UserService {
  public async addUser(payload: Partial<User>): Promise<User> {
    // save to main database
    const user = await User.create(payload)

    // save user to Redis for later fetch users info
    // and user's score for leaderboard sorted set
    await Redis.pipeline().hset(user.id, user.toJSON()).zadd('scores', 0, user.id).exec()

    return user
  }
}
