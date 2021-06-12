import { useState, useEffect } from 'react'
import { goToLoginPage } from 'utils/auth'
import UserService from '../services/user.service'

const BoardModerator = (props) => {
  const [content, setContent] = useState('')

  useEffect(() => {
    UserService.getModeratorBoard().then(
      (response) => {
        setContent(response.data)
      },
      (error) => {
        if (error.response?.status === 401) {
          goToLoginPage(props.history)
        }
        const _content =
          error.response?.data?.message || error.message || error.toString()

        setContent(_content)
      }
    )
  }, [])

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{content}</h3>
      </header>
    </div>
  )
}

export default BoardModerator
