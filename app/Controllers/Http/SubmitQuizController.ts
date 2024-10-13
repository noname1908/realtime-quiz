import { inject } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { quizzes } from 'App/MockData/Quizzes'
import Score from 'App/Models/Score'
import QuizService from 'App/Services/QuizService'
import SubmitQuizValidator from 'App/Validators/SubmitQuizValidator'

@inject()
export default class SubmitQuizController {
  constructor(private quizService: QuizService) {}

  /**
   * @handle
   * @operationId submitQuizById
   * @responseBody 200 - score data
   * @responseBody 404 - not found
   * @responseBody 422 - invalid data
   */
  public async handle({ request, response }: HttpContextContract): Promise<Score | void> {
    const { user_id: userId, answers = [] } = await request.validate(SubmitQuizValidator)
    const quizId = request.param('id')

    const quiz = quizzes.find((quiz) => quiz.id === quizId)
    if (!quiz) {
      return response.notFound('Quiz not found by provided id')
    }

    let score = 0
    for (const answer of answers) {
      const question = quiz.questions.find((question) => question.id === answer.question_id)
      const correctOption = question?.options.find(
        (option) => option.isCorrect && option.id === answer.option_id
      )
      if (correctOption && question?.score) {
        score += question.score
      }
    }

    const newScore = await this.quizService.submit({ userId, score, quizId })

    return newScore
  }
}
