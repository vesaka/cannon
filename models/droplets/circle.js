import Droplet from './droplet';
import { Graphics } from 'pixi.js';
import { Body, Bodies } from 'matter-js';

class Circle extends Droplet {
    constructor(options) {
        super(options);
        
        return this;
    }
    
    filter_radius(radius) {
        return Math.between(radius[0], radius[1]);
    }
    
    drawShape(droplet) {
        const {position, radius} = this;
        droplet.drawCircle(0, 0, radius);
        //droplet.pivot.set(radius, radius);
    }
    
    createBody() {
        const {position, radius, matter, model} = this;
        return Bodies.circle(position.x, position.y, radius, matter);
    }
};

export default Circle;