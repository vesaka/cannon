import Projectile from './projectile';
import { Graphics } from 'pixi.js';
import { Body, Bodies, Sleeping } from 'matter-js';

class Bullet extends Projectile {
    constructor(options) {
        super(options);
        this.durability = 3;
        if (0 === this.index) {
            this.setState('loaded');
        }

        this.$listen({
            'bullet': ['launched', 'loaded', 'loading'],
            'cannon': ['moves']
        });
        return this;
    }
    
    createModel() {
        const bullet = new Graphics;
        const {position, size, radius} = this;
        bullet.position.set(position.x, position.y);
        bullet.beginFill(0xAA99CC, 0.9);
        bullet.lineStyle(2, 0x11FA93);
        bullet.drawCircle(0, 0, radius);
        bullet.endFill();

        return bullet;
    }
    
    createBody() {

        return Bodies.circle(this.position.x, this.position.y, this.radius, this.matter);
    }
    
    bullet_launched(bullet) {
        const { body } = this;
        if (bullet.index === this.index) {
            Sleeping.set(body, false);
            Body.setStatic(body, false);
            Body.setVelocity(body, {
                x: 0,
                y: -50
            });
            
            this.update();
        } else {
            const nextIndex = bullet.index+1 >= this.max ? 0 : bullet.index+1;
            if (this.index === nextIndex && this.isLoading()) {
                this.load();
            }
        }
    }
    
    
};

export default Bullet;