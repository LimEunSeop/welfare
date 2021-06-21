import { db } from '../../db'

export const writeLog = async (code: string, data: object) => {
  await db.log.create({
    data: {
      code,
      data,
    },
  })
}
