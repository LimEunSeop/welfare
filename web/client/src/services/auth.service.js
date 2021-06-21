import axios from 'axios'
import { setUserRelatedVars } from 'utils/auth'

const API_URL = '/rest/auth/'

const register = (email, password, name, phone, orgName) => {
  return axios.post(API_URL + 'signup', {
    email,
    password,
    name,
    phone,
    orgName,
  })
}

const login = (email, password) => {
  return axios
    .post(API_URL + 'signin', {
      email,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        const user = response.data
        localStorage.setItem('user', JSON.stringify(user))
        setUserRelatedVars(user)
      }

      return response.data
    })
}

const logout = () => {
  localStorage.removeItem('user')
  setUserRelatedVars(null)
}

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'))
}

const service = {
  register,
  login,
  logout,
  getCurrentUser,
}

export default service
