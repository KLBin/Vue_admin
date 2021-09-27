import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'

Vue.use(Router)

// 通用页面, 这里的配置不需要权限
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' } // 设置该路由在侧边栏和面包屑中展示的名字
    }]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/menuadmin',
    name: 'Example',
    meta: { title: '系统管理', icon: 'nested' },
    children: [
      {
        path: 'menuadmin',
        name: 'MenuAdmin',
        component: () => import('@/views/system1/index'),
        meta: { title: '菜单管理', icon: 'table' }
      },
      {
        path: 'funct',
        name: 'Function',
        component: () => import('@/views/system2/index'),
        meta: { title: '功能管理', icon: 'table' }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/system3/index'),
        meta: { title: '角色管理', icon: 'table' }
      },
      {
        path: 'userlist',
        name: 'Userlist',
        component: () => import('@/views/system4/index'),
        meta: { title: '用户列表', icon: 'table' }
      }
    ]
  },

  {
    path: '/setup',
    component: Layout,
    redirect: '/setup/setting',
    name: 'Setup',
    meta: { title: '配置管理', icon: 'nested' },
    children: [
      {
        path: 'setting',
        name: 'Setting',
        component: () => import('@/views/setup1/index'),
        meta: { title: '系统设置', icon: 'tree' }
      },
      {
        path: 'business',
        name: 'Business',
        component: () => import('@/views/setup2/index'),
        meta: { title: '业务设置', icon: 'tree' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
