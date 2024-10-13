import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { quizzes } from 'App/MockData/Quizzes'

export default class QuizzesController {
  /**
   * @show
   * @operationId getQuizById
   * @responseBody 200 - quiz data
   * @responseBody 404 - not found
   */
  public async show({ request, response }: HttpContextContract) {
    const quizId = request.param('id')

    const quiz = quizzes.find((quiz) => quiz.id === quizId)
    if (!quiz) {
      return response.notFound('Quiz not found by provided id')
    }

    return quiz
  }
}
