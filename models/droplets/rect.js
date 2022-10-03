import Droplet from './droplet';
import { Graphics } from 'pixi.js';
import { Body, Bodies } from 'matter-js';

class Rect extends Droplet {
    constructor(options) {
        super(options);
        
        return this;
    }
    
    drawShape(droplet) {
        const {position, size} = this;
        const width = Math.between(size[0], size[1]);
        const height = Math.between(size[0], size[1]);
        
        droplet.drawRoundedRect(0, 0, width, height, this.rounded);
        droplet.pivot.set(width / 2, height / 2);
    }
    
    createBody() {
        const {position, model, size, matter} = this;
        
        matter.chamfer = { radius: this.rounded};
        const width = Math.between(size[0], size[1]);
        const height = Math.between(size[0], size[1]);
        return Bodies.rectangle(
                model.position.x,
                model.position.y,
                model.width,
                model.height,
                matter
        );
    }
};

export default Rect;