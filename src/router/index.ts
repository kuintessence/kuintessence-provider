import { route } from 'quasar/wrappers';
import { createMemoryHistory, createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import routes from './routes';
import { LocalStorage } from 'quasar';
import { $mgr } from 'src/boot/oidc';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
    const createHistory = process.env.SERVER ? createMemoryHistory : process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory;

    const Router = createRouter({
        scrollBehavior: () => ({ left: 0, top: 0 }),
        routes,

        // Leave this as is and make changes in quasar.conf.js instead!
        // quasar.conf.js -> build -> vueRouterMode
        // quasar.conf.js -> build -> publicPath
        history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE),
    });

    // 路由前调用
    Router.beforeEach(async (to, from, next) => {
        if (to.name === 'call-back' || to.name === 'silent-renew' || to.name === 'access-denied') {
            next(true);
        } else {
            if (to.meta.title) document.title = (to.meta.title as string) + ' - Kuintessence Provider';
            else document.title = 'Kuintessence Provider';
            if (!(LocalStorage.getItem('token') && (LocalStorage.getItem('expires_at') ? (LocalStorage.getItem('expires_at') as number) : 0) > Math.round(new Date().getTime() / 1000))) {
                // token不存在&token过期，跳转登录
                return await $mgr.signIn();
            }
            //判断权限

            next(true);
        }
    });

    return Router;
});
