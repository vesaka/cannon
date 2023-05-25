import Model from '$lib/game/core/2d/models/matter-model';
import { Graphics, Sprite, Texture } from 'pixi.js';
import { Body, Bodies, Bounds, Sleeping } from 'matter-js';
import Brick from './brick';
import StatesMixin from '$lib/game/core/mixins/states-mixin';
import Matrix from '$core/2d/grids/matrix';
class Ground extends Model {

    constructor(options) {


        super(options);

        this.margin = 50;
        this.mask = 0x000001;
        this.threats = {};
        this.createBricks();
        
        this.$listen({
            damage: ['started', 'stoped'],
            brick: ['broken'],
            game: ['over']
        });
        
        return this;
    }
    
    
    
    createBricks() {
        const {bricks, size, options, model} = this;
        const dim = {
            width: size.width / bricks.columns,
            height: size.height / bricks.rows
        };

        const wall = new Matrix({
            rows: bricks.rows,
            columns: bricks.columns,
            width: size.width,
            height: size.height,
        });
        
        wall.eachSlot(slot => {
            const {x, y} = slot;
 
            if ((y === (bricks.columns-1)) && (1 === x%2)) {
                return;
            }
            
            const preset = Object.assign({
                groundMask: this.mask,
                position: {
                    x: model.position.x + (y*dim.width) + (x%2)*(dim.width/2),
                    y: model.position.y + (x*dim.height)
                }, 
                size: dim,
                mixins: [StatesMixin],
            }, options.models.brick);

            slot.brick = new Brick(preset);
        });
        this.wall = wall;
        
        
        this.strength = bricks.rows * bricks.columns;
        

    }
    
    getHoldingBricks() {
        const bricks = [];
        const bodies = [];
        
        this.eachBrick(brick => {
            if (brick.isHolding()) {
                bricks.push(brick);
                bodies.push(brick.body);
            }
        });
        
        if (!this.gameOver && (bricks.length < 1)) {
            this.$emit('game_over');
            this.eachBrick(brick => {
                brick.update();
            });
        }
        
        return {bricks, bodies};
    }

    createModel() {
        const {app, size, options} = this;
        const ground = new Graphics();
        ground.beginFill(0x224422, 0.1);
        ground.lineStyle(3, 0x224422);
        ground.drawRect(0, 0, size.width, size.height);
        ground.endFill();
        ground.position.set((app.screen.width - size.width) / 2, app.screen.height - size.height - options.world.offset);
        ground.visible = false;
        return ground;
    }

    createBody() {
        const {app, size, offset, options, model} = this;

        return Bodies.rectangle(
                model.position.x + size.width/2,
                app.screen.height - size.height/2 - options.world.offset,
                size.width,
                size.height,
                {
                    isStatic: true
                });
    }
    
    filter_size(size) {
        return {
            width: this.app.screen.width * size.width,
            height: this.app.screen.height * size.height
        };
    }
    
    damage_started(droplet) {
        const wall = this.wall;
        
        this.threats[droplet.body.id] = setInterval(() => {
            let stop = false;
            this.eachBrick(brick => {
                if (!stop && Math.random() > 0.9 && brick.isHolding()) {
                    brick.weaken();
                    stop = true;
                }
            });
        }, 300);
    }
    
    damage_stoped(droplet) {
        clearInterval(this.threats[droplet.body.id]);
        this.threats[droplet.body.id] = null;
    }

    getSize() {
        if (!this.size) {
            this.size = {
                width: this.app.screen.width - this.offset * 2,
                height: this.options.world.offset
            };
        }

        return this.size;
    }
    
    eachBrick(callback) {
        this.wall.eachSlot(slot => {
            if (slot.brick) {
                callback(slot.brick, slot);
            }
        });
    }
    
    game_over() {
//        Body.setStatic(this.body, false);
//        Sleeping.set(this.body, false);
//        this.eachBrick(brick => {
//            Body.setStatic(brick.body, false);
//            Sleeping.set(brick.body, false);
//        });
        
        
    }
    
}
;

export default Ground;