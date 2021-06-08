import { BrowserRouter, Route, Switch } from 'react-router-dom'
import './App.css'
import Dashboard from '../Dashboard/Dashboard'
import Preferences from '../Preferences/Preferences'
import Login from 'components/Login/Login'
import useToken from './useToken'

export default function App() {
  const { token, setToken } = useToken()

  if (!token) {
    return <Login setToken={setToken} />
  }
  return (
    <div className="wrapper">
      <h1>Application</h1>
      <BrowserRouter>
        <Switch>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/preferences">
            <Preferences />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  )
}
