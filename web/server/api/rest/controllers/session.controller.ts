import { current, writeLog } from '../utils'
import { db } from './../../db'

export async function getProgramSession(req, res) {
  const sessionId = Number(req.params.sessionId)

  // 미들웨어에서 검증한 session이 param으로 넘긴 sessionId 와 같은지 다시한번 확인.
  // 거짓이라면 미들웨어로 세션 권한 검증을 안한것임. 이 컨트롤러는 꼭 canUseProgram 을 거쳐야만 사용가능함.
  if (sessionId !== req.sessionId) {
    return res.status(403).send({ message: '잘못된 접근입니다.' })
  }

  try {
    const session = await db.programSession.findUnique({
      where: { id: sessionId },
      include: {
        org: true,
        program: true,
      },
    })

    if (!session) {
      return res
        .status(404)
        .send({ message: '해당 프로그램 세션이 존재하지 않습니다.' })
    }

    // OrganizationUsePrograms 의 id, org, program, expiryDate 를 반환한다.

    return res.status(200).json({
      id: session.id,
      org: session.org,
      program: session.program,
      expiryDate: session.expiryDate,
    })
  } catch (e) {
    return res.status(500).send({ message: e.message })
  }
}

async function getProgramSessionList(req, res) {
  const sessions = await db.programSession.findMany({
    where: {
      orgId: req.orgId,
    },
    include: {
      program: true,
    },
  })

  return res.status(200).json(sessions)
}

async function addProgramSession(req, res) {
  const orgId = Number(req.orgId)
  const programId = Number(req.body.programId)
  const sessionName = req.body.sessionName

  const session = await db.programSession.create({
    data: {
      orgId,
      programId,
      name: sessionName,
      expiryDate: current().add(30, 'days').toISOString(),
    },
    include: {
      program: true,
    },
  })

  writeLog('CREATE_SESSION', { userId: req.userId, sessionId: session.id })

  return res.status(200).json(session)
}

const controller = {
  getProgramSession,
  getProgramSessionList,
  addProgramSession,
}

export default controller
