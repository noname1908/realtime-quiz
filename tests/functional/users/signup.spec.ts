import Redis from '@ioc:Adonis/Addons/Redis'
import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

test.group('Users signup', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return async () => {
      await Redis.flushdb()
      await Database.rollbackGlobalTransaction()
    }
  })

  test('should return an error when there is invalid user name', async ({ client }) => {
    const response = await client.post('/v1/users/signup').json({ name: 123 })

    response.assertStatus(422)
  })

  test('should signup an user successfully', async ({ client, assert }) => {
    const response = await client.post('/v1/users/signup').json({ name: 'join' })

    response.assertStatus(200)
    response.assertAgainstApiSpec()

    const responseUser = response.body()
    const [name] = await Redis.hmget(responseUser.id, 'name')
    assert.equal(name, 'join')

    const scores = await Redis.zrevrange('scores', 0, -1, 'WITHSCORES')
    assert.lengthOf(scores, 2)
    assert.equal(scores?.[0], responseUser.id)
  })
})
