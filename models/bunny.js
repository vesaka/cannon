import Model from '$lib/game/core/2d/models/matter-model';
import { Graphics, Sprite, Texture } from 'pixi.js';
import { Body, Bodies } from 'matter-js';

class Bunny extends Model {
    constructor(options, index) {
        options.index = index;
        super(options);

        //this.scale = Math.between(min, max);
        return this;
    }

    static setTexture(asset) {



        //const state = new Sprite(texture, size.width, size.height);
        Bunny.prototype.texture = Texture.from(asset.url);
    }
    
    filter_size() {
        const { width, height } = Bunny.prototype.texture;
        
        return {width, height};
    }

    filter_position() {
        const {app, options} = this;

return {
            x: this.index * 30,
            y: Math.between(options.world.offset*2, options.world.offset*4)
        };
        return {
            x: Math.between(options.world.offset, app.screen.width - options.world.offset),
            y: Math.between(options.world.offset*2, options.world.offset*4)
        };
    }

    createModel() {
        const {app} = this;
        const texture = Bunny.prototype.texture;
        const bunny = new Sprite(texture);

        bunny.anchor.x = 0.5;
        bunny.anchor.y = 0.5;

        bunny.position.set(this.position.x, this.position.y);


        return bunny;
    }

    createBody() {
        const texture = Bunny.prototype.texture;
        return Bodies.rectangle(
                this.position.x + this.size.width/2,
                this.position.y + this.size.height/2,
                this.size.width,
                this.size.height,
                {
                    mass: 5,
                    frictionAir: 0.001,
                    restitution: 0.75
                });
    }
}
;

export default Bunny;