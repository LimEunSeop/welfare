import { useState, useEffect } from 'react'
import { Switch, Route, Link, useHistory } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

import AuthService from './services/auth.service'

import Login from './components/Login'
import Register from './components/Register'
import Home from './components/Home'
import Profile from './components/Profile'
import BoardUser from './components/BoardUser'
import BoardModerator from './components/BoardModerator'
import BoardAdmin from './components/BoardAdmin'
import { useReactiveVar } from '@apollo/client'
import { vars } from 'graphql.config'
import { getCurrentUser } from './services/auth.service'
import { goToLoginPage, setUserRelatedVars } from 'utils/auth'
import axios from 'axios'
import { Button } from 'antd'

function App(props) {
  const currentUser = useReactiveVar(vars.currentUser)
  const visibility = useReactiveVar(vars.visibility)
  const history = useHistory()

  const [refreshExpired, setRefreshExpired] = useState(false)

  useEffect(() => {
    const user = getCurrentUser()
    setUserRelatedVars(user)
  }, [])

  useEffect(() => {
    const tokenRefresher = () => {
      axios
        .post('/rest/auth/refreshtoken', {
          refreshToken: currentUser.refreshToken,
        })
        .then(
          (response) => {
            const { accessToken, refreshToken } = response.data

            const user = JSON.parse(localStorage.getItem('user'))
            user.accessToken = accessToken
            user.refreshToken = refreshToken
            localStorage.setItem('user', JSON.stringify(user))

            setRefreshExpired(false)
          },
          (error) => {
            console.error(
              error.response?.data?.message || error.message || error.toString()
            )
            setRefreshExpired(true)
          }
        )
    }

    let intervalID = null

    if (currentUser) {
      // 토큰 리프레쉬 타이머 설정
      let tokenRefreshTime = currentUser.tokenExpiresIn
        ? currentUser.tokenExpiresIn - 60
        : 300

      tokenRefresher()
      intervalID = window.setInterval(tokenRefresher, tokenRefreshTime * 1000)
    }

    return () => {
      window.clearInterval(intervalID)
    }
  }, [currentUser])

  const logOut = () => {
    AuthService.logout()
  }

  return (
    <div>
      <Button type="primary" onClick={() => goToLoginPage(history)}>
        로그인
      </Button>

      {refreshExpired && (
        <p>
          리프레쉬 토큰이 만료되었습니다. 다시 로그인 하시기 바랍니다.{' '}
          <Button type="primary" onClick={() => goToLoginPage(history)}>
            로그인
          </Button>
        </p>
      )}
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to={'/'} className="navbar-brand">
          bezKoder
        </Link>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={'/home'} className="nav-link">
              Home
            </Link>
          </li>

          {visibility.moderator && (
            <li className="nav-item">
              <Link to={'/mod'} className="nav-link">
                Moderator Board
              </Link>
            </li>
          )}

          {visibility.admin && (
            <li className="nav-item">
              <Link to={'/admin'} className="nav-link">
                Admin Board
              </Link>
            </li>
          )}

          {visibility.user && (
            <li className="nav-item">
              <Link to={'/user'} className="nav-link">
                User
              </Link>
            </li>
          )}
        </div>

        {currentUser ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={'/profile'} className="nav-link">
                {currentUser.username}
              </Link>
            </li>
            <li className="nav-item">
              <Link to={'/login'} className="nav-link" onClick={logOut}>
                LogOut
              </Link>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={'/login'} className="nav-link">
                Login
              </Link>
            </li>

            <li className="nav-item">
              <Link to={'/register'} className="nav-link">
                Sign Up
              </Link>
            </li>
          </div>
        )}
      </nav>

      <div className="container mt-3">
        <Switch>
          <Route exact path={['/', '/home']} component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/profile" component={Profile} />
          <Route path="/user" component={BoardUser} />
          <Route path="/mod" component={BoardModerator} />
          <Route path="/admin" component={BoardAdmin} />
        </Switch>
      </div>
    </div>
  )
}

export default App
