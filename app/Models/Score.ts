import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

export default class Score extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  // @required
  public userId: string

  @column()
  public quizId: string

  @column()
  public score: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
