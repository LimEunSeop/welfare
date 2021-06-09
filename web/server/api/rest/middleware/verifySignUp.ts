import { db, ROLES } from '../../db'

const User = db.user

export async function checkDuplicateUsernameOrEmail(req, res, next) {
  // Username
  let user = await User.findUnique({
    where: {
      username: req.body.username,
    },
  })

  if (user) {
    res.status(400).send({
      message: '아이디가 중복되었습니다.',
    })
    return
  }

  user = await User.findUnique({
    where: {
      email: req.body.email,
    },
  })

  if (user) {
    res.status(400).send({
      message: '이메일이 중복되었습니다.',
    })
    return
  }

  next()
}

export async function checkRolesExisted(req, res, next) {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: req.body.roles[i] + ' 라는 역할은 존재하지 않습니다.',
        })
        return
      }
    }
  }

  next()
}
