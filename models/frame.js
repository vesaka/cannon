import Model from '$lib/game/core/2d/models/matter-model';
import { Graphics, Texture } from 'pixi.js';
import { Bodies, Bounds } from 'matter-js';

class Frame extends Model {
    constructor(options = {}) {
        super(options);

        return this;
    }
    
    createBody() {
        return Bodies.rectangle(0, 0, this.app.screen.width, this.app.screen.height, {
            isSensor: true,
            isStatic: true
        });
    }
};

export default Frame;