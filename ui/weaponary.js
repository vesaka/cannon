import UI from '$lib/game/core/2d/display/ui';

import Bullet from './bullet';
import Beam from './beam';
import Bomb from './bomb';


class Weaponary extends UI {
    constructor(options) {
        super(options);
        this.bullets = []
    }
};

export { Bullet, Beam, Bomb };

export default Weaponary;


