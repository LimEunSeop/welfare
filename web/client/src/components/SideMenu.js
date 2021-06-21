import { Menu } from 'antd'
import { Link, useRouteMatch } from 'react-router-dom'

const { SubMenu } = Menu

const SideMenu = ({ menus, selectedMenu }) => {
  const match = useRouteMatch()

  return (
    <Menu
      theme="dark"
      selectedKeys={[selectedMenu]}
      mode="vertical"
      triggerSubMenuAction="click"
    >
      {menus
        .sort((a, b) => a.order - b.order)
        .map((firstMenu) => (
          <SubMenu
            key={firstMenu.id}
            icon={firstMenu.icon}
            title={firstMenu.name}
          >
            {firstMenu.children
              ?.sort((a, b) => a.order - b.order)
              .map((secondMenu) => {
                return secondMenu.children ? (
                  <SubMenu key={secondMenu.id} title={secondMenu.name}>
                    {secondMenu.children
                      .sort((a, b) => a.order - b.order)
                      .map((thirdMenu) => (
                        <Menu.Item key={thirdMenu.path}>
                          <Link to={`${match.url}/${thirdMenu.path}`}></Link>
                          {thirdMenu.name}
                        </Menu.Item>
                      ))}
                  </SubMenu>
                ) : (
                  <Menu.Item key={secondMenu.path}>
                    <Link to={`${match.url}/${secondMenu.path}`}>
                      {secondMenu.name}
                    </Link>
                  </Menu.Item>
                )
              })}
          </SubMenu>
        ))}
    </Menu>
  )
}

export default SideMenu
