import { Route, Switch } from 'react-router-dom'
import Session from './Session'
import SessionLinks from './SessionList'

const SessionIndex = ({ match }) => {
  return (
    <Switch>
      <Route path={`/:orgId/:sessionId`} component={Session} />
      <Route path={`/:orgId`} component={SessionLinks} />
    </Switch>
  )
}

export default SessionIndex
