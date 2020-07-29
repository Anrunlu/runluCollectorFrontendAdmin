import getPageTitle from 'src/utils/get-page-title'
import { getToken } from 'src/utils/auth'
import { LoadingBar } from 'quasar'

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/cli-documentation/boot-files#Anatomy-of-a-boot-file
export default async ( { router, store } ) => {
  router.beforeEach(async (to, from, next) => {
    // start progress bar
    LoadingBar.start()
    // set page title
    document.title = getPageTitle(to.meta.title)
    next()

    // determine whether the user has logged in
    const hasToken = getToken()

    if (hasToken) {
      if (to.path === '/login') {
        // if is logged in, redirect to the home page
        next({ path: '/' })
        LoadingBar.stop()
      } else {
        const userlevel = store.getters['user/userlevel']
        if (userlevel > 0) {
          next()
          LoadingBar.stop()
        } else {
          try {
            await store.dispatch('user/getUserInfo')
            // set the replace: true, so the navigation will not leave a history record
            next({ ...to, replace: true })
            LoadingBar.stop()
          } catch (error) {
            console.log(error)
            next(`/login?redirect=${to.path}`)
            LoadingBar.stop()
          }
        }
      }
    } else {
      // 没有token并且不是公开页面就跳转到登录页面
      if (!to.meta.isPublic) {
        // 登录后跳转到进入的页面
        next({ path: '/login', query: { redirect: to.fullPath } })
        LoadingBar.stop()
      } else {
        next()
        LoadingBar.stop()
      }
    }
  })
  // something to do
}
