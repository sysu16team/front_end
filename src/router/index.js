import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import taskDetail from '@/components/task_detail'
import myTask from '@/components/my_task'
import myReleaseTask from '@/components/my_releaseTask'
import myAcceptTask from '@/components/my_acceptTask'
import personalInfo from '@/components/personalinfo'
import personalPage from '@/components/personalpage'
import MainPage from '@/components/MainPage'
import taskSearch from '@/components/task_search'
import taskRelease from '@/components/task_release'
import groupSearch from '@/components/groupSearch'
import myGroup from '@/components/mygroup'
import createGroup from '@/components/createGroup'
import groupDetail from '@/components/groupDetail'
import defaultGroupDetail from '@/components/defaultGroupDetail'
import modifyGroupInfo from '@/components/modifyGroupInfo'
import login from '@/components/login'
import register from '@/components/register'
import userInfo from '@/components/userInfo'
import deposit from '@/components/deposit'
import withdraw from '@/components/withdraw'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      redirect: '/login',
    },
    {
      path: '/MainPage',
      name: 'MainPage',
      component: MainPage,
      redirect: '/MainPage/task_search',
      children: [
        {
          path: '/MainPage/task_search',
          name: 'taskSearch',
          component: taskSearch
        },
        {
          path: '/MainPage/task_release',
          name: 'taskRelease',
          component: taskRelease
        },
        {
          path: '/MainPage/my_task',
          name: 'mytask',
          component: myTask,
          redirect: '/MainPage/my_task/my_acceptTask',
          children: [
            {
              path: '/MainPage/my_task/my_acceptTask',
              name: 'myAcceptTask',
              component: myAcceptTask
            },
            {
              path: '/MainPage/my_task/my_releaseTask',
              name: 'myReleaseTask',
              component: myReleaseTask
            },
          ]
        },
        {
          path: '/MainPage/my_acceptTask',
          name: 'myAcceptTask',
          component: myAcceptTask
        },
        {
          path: '/MainPage/my_releaseTask',
          name: 'myReleaseTask',
          component: myReleaseTask
        },
        {
          path: '/MainPage/groupSearch',
          name: 'groupSearch',
          component: groupSearch
        },
        {
          path: '/MainPage/mygroup',
          name: 'myGroup',
          component: myGroup,
        },
        {
          path: '/MainPage/createGroup',
          name: 'createGroup',
          component: createGroup
        },
        {
          path: '/MainPage/task_detail/:id',
          name: 'taskDetail',
          component: taskDetail
        },
        {
          path: '/MainPage/groupDetail/:id',
          name: 'groupDetail',
          component: groupDetail
        },
        {
          path: '/MainPage/defaultGroupDetail/:id',
          name: 'defaultGroupDetail',
          component: defaultGroupDetail
        },
        {
          path: '/MainPage/groupDetail/:id/modifyInfo',
          name: 'modifyGroupInfo',
          component: modifyGroupInfo
        },
      ]
    },
    {
      path: '/personalpage',
      name: 'personalPage',
      component: personalPage,
      children:[
        {
          path: '/personalpage/personalinfo',
          name: 'personalInfo',
          component: personalInfo
        },
        {
          path: '/personalpage/deposit',
          name: 'deposit',
          component: deposit
        },
        {
          path: '/personalpage/withdraw',
          name: 'withdraw',
          component: withdraw
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/user/:username',
      name: 'userInfo',
      component: userInfo
    }

  ]
})
