import Model from '$lib/game/core/2d/models/matter-model';
import { Graphics, Sprite, Texture } from 'pixi.js';
import { Bodies, Body, Sleeping, Bounds } from 'matter-js';

const BROKEN = 'broken';
class Brick extends Model {

    constructor(options) {


        super(options);

        this.mask = 0x000002;
        this.maxStrength = this.strength;
        this.$listen({
            game: ['reset', 'over']
        });
        
        this.states = [BROKEN];
        return this;
    }

    createModel() {
        const {position, size, options} = this;
        const brick = new Graphics();
        brick.beginFill(0xc34a36);
        brick.lineStyle(2, 0x2D2834);
        brick.drawRect(0, 0, size.width, size.height);
        brick.endFill();
        brick.position.set(position.x, position.y);

        return brick;
    }

    createBody() {
        const {app, size, offset, matter, model} = this;

        //matter.collisionFilter = {mask: this.mask | this.groundMask};
        return Bodies.rectangle(
                model.position.x + size.width / 2,
                model.position.y + size.height / 2,
                size.width,
                size.height,
                matter);
    }

    weaken() {
        if (this.strength <= 0) {
            return;
        }

        this.strength--;


        if (this.strength < -1) {
            this.addState(BROKEN);
            Body.setStatic(this.body, false);
            Sleeping.set(this.body, false);
            this.$emit('brick_broken');
            this.strength = 0;
        } else {
            this.model.alpha = Math.max(0.2, (this.strength * (1 / this.maxStrength).toFixed(2)));

        }
    }

    isHolding() {
        return this.strength > 0;
    }

    isBroken() {
        return this.strength <= 0;
    }

    game_reset() {
        Body.setStatic(this.body, true);
        Sleeping.set(this.body, true);
        this.removeState(BROKEN);
        this.strength = this.maxStrength;
        this.model.alpha = 1;
    }

}

export default Brick;