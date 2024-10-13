import Redis from '@ioc:Adonis/Addons/Redis'
import Event from '@ioc:Adonis/Core/Event'
import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { quizzes } from 'App/MockData/Quizzes'
import UserService from 'App/Services/UserService'

test.group('Quizzes submit by id', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    return async () => {
      await Redis.flushdb()
      await Event.restore()
      await Database.rollbackGlobalTransaction()
    }
  })

  test('should submit a quiz successfully', async ({ client, assert }) => {
    const userService = new UserService()
    const user = await userService.addUser({ name: 'join' })
    const quiz = quizzes[0]

    const response = await client.post(`/v1/quizzes/${quiz.id}/submitting`).json({
      user_id: user.id,
      answers: quiz.questions.map((question) => ({
        question_id: question.id,
        option_id: question.options[0].id,
      })),
    })

    response.assertStatus(200)
    response.assertBodyContains({
      user_id: user.id,
      quiz_id: quiz.id,
      score: 3,
    })

    const scores = await Redis.zrevrange('scores', 0, -1, 'WITHSCORES')
    assert.lengthOf(scores, 2)
    assert.equal(scores?.[0], user.id)
    assert.equal(scores?.[1], '3')
  })
})
