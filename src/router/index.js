import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/setting', component: () => import('@/views/login/setting'), hidden: true},
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  { path: '*', redirect: '/404', hidden: true },

  // 广告位
  {
    path: '/adplacement',
    component: Layout,
    redirect: 'adplacement/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/adplacement/index'),
        name: '广告位',
        meta: { title: '广告位', icon: 'adplacement', noCache: true}
      }
    ]
  },

  // 素材
  {
    path: '/material',
    component: Layout,
    redirect: 'material/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/material/index'),
        name: '素材',
        meta: { title: '素材', icon: 'adplacement', noCache: true}
      },
      {
        path: 'edit',
        component: () => import('@/views/material/edit'),
        name: '编辑素材',
        meta: { title: '编辑素材', icon: 'adplacement', noCache: true},
        hidden: true
      }
    ]
  },

  // 统计
  {
    path: '/odsBid',
    component: Layout,
    redirect: 'material/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/odsBid/index'),
        name: '统计',
        meta: { title: '统计', icon: 'adplacement', noCache: true}
      }
    ]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

// export const asyncRouterMap = [
//   // 广告位
//   {
//     path: '/adplacement',
//     component: Layout,
//     redirect: 'adplacement/index',
//     meta: {
//       roles: ['editor'] // you can set roles in root nav
//     },
//     children: [
//       {
//         path: 'index',
//         component: () => import('@/views/adplacement/index'),
//         name: '广告位',
//         meta: { title: '广告位', icon: 'adplacement', noCache: true}
//       }
//     ]
//   }
// ]


