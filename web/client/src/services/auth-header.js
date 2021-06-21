export default function authHeader(orgId, sessionId) {
  const user = JSON.parse(localStorage.getItem('user'))

  let headerObj = {}

  if (user?.accessToken) {
    headerObj = { ...headerObj, 'x-access-token': user.accessToken }
  }

  if (orgId) {
    headerObj = { ...headerObj, 'x-org-id': orgId }
  }

  if (sessionId) {
    headerObj = { ...headerObj, 'x-program-session-id': sessionId }
  }

  return headerObj
}
