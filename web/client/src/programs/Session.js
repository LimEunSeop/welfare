import { useEffect, useState } from 'react'
import Jugan from './jugan'
import Bangmun from './bangmun'
import Ganho from './ganho'
import Mokyok from './mokyok'
import Layout, { Content } from 'antd/lib/layout/layout'
import AppHeader from 'components/AppHeader'
import sessionService from 'services/session.service'
import { vars } from 'graphql.config'
import { useReactiveVar } from '@apollo/client'
import Loading from 'components/Loading'
import ErrorDisplay from 'components/ErrorDisplay'

const Program = ({ match }) => {
  const orgId = match.params.orgId
  const sessionId = match.params.sessionId

  const currentSession = useReactiveVar(vars.currentSession)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)

    sessionService
      .getProgramSession(sessionId)
      .then((res) => {
        vars.currentSession(res.data)
        // console.log(res.data)
        setLoading(false)
      })
      .catch((error) => {
        setError(error)
        setLoading(false)
      })

    // 이 API 가 통하는 놈이라면 sessionList RV(Reactive Variable) 가 세팅돼 있을것임
    sessionService
      .getProgramSessionList(orgId)
      .then((res) => {
        vars.sessionList(res.data)
      })
      .catch(() => vars.sessionList(null))
  }, [sessionId, orgId])

  switch (currentSession?.program?.name) {
    case 'jugan':
      return <Jugan />
    case 'bangmun':
      return <Bangmun />
    case 'ganho':
      return <Ganho />
    case 'mokyok':
      return <Mokyok />
    default:
      return (
        <Layout id="app-layout" style={{ minHeight: '100vh' }}>
          <Layout className="site-layout">
            <AppHeader showProfile={false} />
            <Content
              style={{
                display: 'grid',
                placeItems: 'center',
                gridTemplateRows: '100%',
              }}
            >
              {loading ? <Loading /> : error && <ErrorDisplay error={error} />}
            </Content>
          </Layout>
        </Layout>
      )
  }
}

export default Program
