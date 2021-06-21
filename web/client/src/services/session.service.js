import axios from 'axios'
import authHeader from './auth-header'

const API_URL = '/rest/sessions'

const getProgramSession = (sessionId) => {
  return axios.get(`${API_URL}/${sessionId}`, {
    headers: authHeader(null, sessionId),
  })
}

const getProgramSessionList = (orgId) => {
  return axios.get(`${API_URL}`, {
    headers: authHeader(orgId),
  })
}

const addProgramSession = (orgId, programId, sessionName) => {
  return axios.post(
    `${API_URL}`,
    { programId, sessionName },
    {
      headers: authHeader(orgId),
    }
  )
}

const service = { getProgramSession, getProgramSessionList, addProgramSession }

export default service
