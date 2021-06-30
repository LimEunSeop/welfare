import React, { useState, useEffect } from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'
import './App.css'

import ProgramIndex from './programs'
import Login from './components/Login/Login'
import { useReactiveVar } from '@apollo/client'
import { vars } from 'graphql.config'
import { getCurrentUser } from './services/auth.service'
import { setUserRelatedVars } from 'utils/auth'
import axios from 'axios'
import Register from 'components/Register'

function App() {
  const currentUser = useReactiveVar(vars.currentUser)

  const [refreshExpired, setRefreshExpired] = useState(false)

  const history = useHistory()

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
  }, [currentUser, history])

  useEffect(() => {
    const user = getCurrentUser()
    if (!refreshExpired && user) {
      setUserRelatedVars(user)
    } else {
      history.replace('/login')
    }
  }, [history, refreshExpired])

  return (
    <Switch>
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      <Route path={`/:orgId`} component={ProgramIndex} />
    </Switch>
  )

  // <div>
  //   {refreshExpired && (
  //     <p>
  //       리프레쉬 토큰이 만료되었습니다. 다시 로그인 하시기 바랍니다.{' '}
  //       <Button type="primary" onClick={() => goToLoginPage(history)}>
  //         로그인
  //       </Button>
  //     </p>
  //   )}
  //   <nav className="navbar navbar-expand navbar-dark bg-dark">
  //     <Link to={'/'} className="navbar-brand">
  //       bezKoder
  //     </Link>
  //     <div className="navbar-nav mr-auto">
  //       <li className="nav-item">
  //         <Link to={'/home'} className="nav-link">
  //           Home
  //         </Link>
  //       </li>

  //       {visibility.moderator && (
  //         <li className="nav-item">
  //           <Link to={'/mod'} className="nav-link">
  //             Moderator Board
  //           </Link>
  //         </li>
  //       )}

  //       {visibility.admin && (
  //         <li className="nav-item">
  //           <Link to={'/admin'} className="nav-link">
  //             Admin Board
  //           </Link>
  //         </li>
  //       )}

  //       {visibility.user && (
  //         <li className="nav-item">
  //           <Link to={'/user'} className="nav-link">
  //             User
  //           </Link>
  //         </li>
  //       )}
  //     </div>

  //
  //   </nav>

  //   <div className="container mt-3">
  //
  //   </div>
  // </div>
}

export default App
