import { vars } from 'graphql.config'

export function goToLoginPage(history) {
  history.replace(
    '/login?returnPath=' + window.location.pathname + window.location.search
  )
}

export function setUserRelatedVars(user) {
  if (user) {
    vars.currentUser(user)
    vars.visibility({
      user: user.roles.includes('ROLE_USER'),
      moderator: user.roles.includes('ROLE_MODERATOR'),
      admin: user.roles.includes('ROLE_ADMIN'),
    })
  } else {
    vars.currentUser(null)
    vars.visibility({
      user: false,
      moderator: false,
      admin: false,
    })
  }
}
