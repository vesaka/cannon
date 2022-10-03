import Projectile from './projectile';
import { Graphics, } from 'pixi.js';
import { Body } from 'matter-js';

class Beam extends Projectile {
    constructor(options) {
        super(options);
        
        return this;
    }
};

export default Beam;