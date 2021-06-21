import { useReactiveVar } from '@apollo/client'
import Avatar from 'antd/lib/avatar/avatar'
import { Header } from 'antd/lib/layout/layout'
import { vars } from 'graphql.config'
import { Link, useHistory, useRouteMatch } from 'react-router-dom'
import AuthService from 'services/auth.service'
import { UserOutlined, DownOutlined } from '@ant-design/icons'
import { Button, Dropdown, Menu, Space, message, Row, Col } from 'antd'
import { useCallback } from 'react'

const AppHeader = ({ showProfile = false, programSelectable = true }) => {
  const currentUser = useReactiveVar(vars.currentUser)
  const sessions = useReactiveVar(vars.sessionList)
  const currentSession = useReactiveVar(vars.currentSession)

  const history = useHistory()
  const match = useRouteMatch()

  const logOut = () => {
    AuthService.logout()
  }

  const handleMenuClick = useCallback(
    (e) => {
      const selectedSession = sessions.find(
        (session) => session.id === Number(e.key)
      )
      const sessionName =
        selectedSession.name || selectedSession.program.description
      message.info(`${sessionName}(으)로 변경합니다.`)
      history.replace(
        match.url.replace(/(\/\d)\/\d/, `$1/${selectedSession.id}`)
      )
    },
    [match.url, history, sessions]
  )

  return (
    <Header
      className="site-layout-background"
      align="end"
      style={{
        padding: '0 16px',
      }}
    >
      <Row justify="space-between">
        <Col style={{ visibility: programSelectable ? 'visible' : 'hidden' }}>
          <Dropdown
            trigger="click"
            overlay={
              <Menu onClick={handleMenuClick}>
                {sessions?.map((session) => (
                  <Menu.Item key={session.id}>
                    {session.name || session.program.description}
                  </Menu.Item>
                ))}
              </Menu>
            }
          >
            <Button>
              {currentSession?.name || currentSession?.program.description}{' '}
              <DownOutlined />
            </Button>
          </Dropdown>
        </Col>

        <Col>
          <Space size="middle">
            <span>{currentUser?.name}</span>
            {showProfile && (
              <Link to={`${match.url}/profile`}>
                <Avatar size="large" icon={<UserOutlined />} />
              </Link>
            )}
            <Button
              // type="primary"
              size="large"
              onClick={() => {
                logOut()
                history.push('/login')
              }}
              danger
            >
              {currentUser ? '로그아웃' : '로그인'}
            </Button>
          </Space>
        </Col>
      </Row>
    </Header>
  )
}

AppHeader.defaultProps = {
  showProfile: true,
}

export default AppHeader
