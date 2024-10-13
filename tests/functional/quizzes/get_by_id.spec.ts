import { test } from '@japa/runner'
import { quizzes } from 'App/MockData/Quizzes'

test.group('Quizzes get by id', () => {
  test('should return an error when there is invalid quiz id', async ({ client }) => {
    const response = await client.get(`/v1/quizzes/wrong`)

    response.assertStatus(404)
  })

  test('should get a quiz successfully', async ({ client, assert }) => {
    const response = await client.get('/v1/quizzes/1')

    response.assertStatus(200)
    // response.assertAgainstApiSpec()

    assert.deepEqual(response.body(), quizzes[0])
  })
})
