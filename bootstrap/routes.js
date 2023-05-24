import Playground from '$cn/components/pages/Game.vue';
import Home from '$cn/components/pages/Home.vue';
import NotFound from '$cn/components/pages/404.vue';


import {
    BASE, PLAY_PATH, PAGE_404
} from './paths.js';

const routes = [
    {
        path: BASE,
        name: 'home',
        component: Home,
        meta: {
            title: 'Welcome',
            transitionName: 'slide-left',
        }
    },
    {
        path: PLAY_PATH,
        name: 'playground',
        component: Playground,
        meta: {
            title: 'Playground'
        }
    },
    {
        path: PAGE_404,
        name: 'not-found',
        component: NotFound,
        meta: {
            title: '404',
            transitonName: 'scale-up',
        }
    },
];

export default routes;