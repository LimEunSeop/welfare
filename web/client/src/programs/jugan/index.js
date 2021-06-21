import { useState, useCallback } from 'react'
import { Layout, Breadcrumb } from 'antd'
import { menus } from './menus'
import SideMenu from 'components/SideMenu'
import AppHeader from 'components/AppHeader'
import AppFooter from 'components/AppFooter'
import { Redirect, Route, Switch, useRouteMatch } from 'react-router'
import { createRoutes } from 'utils/route'
import * as pages from './pages'
import Profile from 'components/Profile'

const { Content, Sider } = Layout

const routes = createRoutes(menus)

const Jugan = () => {
  const [sideCollapsed, setSideCollapsed] = useState(false)
  const match = useRouteMatch()

  const sideToggle = useCallback(() => {
    setSideCollapsed(!sideCollapsed)
  }, [sideCollapsed])

  const pagePath = window.location.pathname.replace(match.url + '/', '')

  return (
    <Layout id="app-layout" style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={sideCollapsed} onCollapse={sideToggle}>
        <div className="logo" />
        <SideMenu menus={menus} selectedMenu={pagePath} />
      </Sider>
      <Layout className="site-layout">
        <AppHeader />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Switch>
              <Route
                exact
                path={`${match.path}/profile`}
                render={() => <Breadcrumb.Item>회원정보</Breadcrumb.Item>}
              />
              <Route
                exact
                path={[
                  `${match.path}/:first/:second`,
                  `${match.path}/:first/:second/:third`,
                ]}
                render={() =>
                  routes
                    .find((route) => route.path === pagePath)
                    .breadcrumbs.map((name, i) => (
                      <Breadcrumb.Item key={i}>{name}</Breadcrumb.Item>
                    ))
                }
              />
            </Switch>
          </Breadcrumb>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            <Switch>
              {routes.map((route, i) => (
                <Route
                  key={i}
                  exact
                  path={`${match.path}/${route.path}`}
                  component={pages[`p${route.path.replaceAll('/', '_')}`]}
                />
              ))}
              <Route exact path={`${match.path}/profile`} component={Profile} />
              <Redirect to={`${match.path}/profile`} />
            </Switch>
          </div>
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  )
}

export default Jugan
