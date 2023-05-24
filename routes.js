/* global require */

import Home from '$cn/pages/Home.vue';
import Game from '$cn/pages/Game.vue';
//import Settings from '$cn/pages/Settings.vue';
//import Tutorial from '$cn/pages/Tutorial.vue';

const PATHNAME = `/game/cannon/`;

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    }, 
    {
        path: '/playground',
        name: 'Playground',
        component: Game
    }
];
//    requireScreens.keys().forEach(name => {
//        
//        const screen = requireScreens(name);
//        const screenName = name.toLowerCase().substring(2, name.indexOf('.vue'));
//        routes.push({
//            path: `${PATHNAME}${(screen.default.path || screenName)}`,
//            name: screenName,
//            component: screen.default
//        });
//    });
//    
//    
//cons
//    
export default routes;