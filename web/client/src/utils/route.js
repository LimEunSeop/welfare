export const createRoutes = (menus) => {
  const routes = []

  for (let i = 0; i < menus.length; i++) {
    if (!menus[i].children) continue

    for (let j = 0; j < menus[i].children.length; j++) {
      if (!menus[i].children[j].children) {
        routes.push({
          breadcrumbs: [menus[i].name, menus[i].children[j].name],
          path: menus[i].children[j].path,
        })
        continue
      }
      for (let k = 0; k < menus[i].children[j].children.length; k++) {
        routes.push({
          breadcrumbs: [
            menus[i].name,
            menus[i].children[j].name,
            menus[i].children[j].children[k].name,
          ],
          path: menus[i].children[j].children[k].path,
        })
      }
    }
  }

  return routes
}
