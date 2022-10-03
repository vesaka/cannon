import Model from '$lib/game/core/2d/models/matter-model';
import { Graphics, Point } from 'pixi.js';
import { Body, Events, Query, Bounds } from 'matter-js';

const ABOVE = 'above';
const LEFT = 'left';
const RIGHT = 'right';
const BELLOW = 'bellow';

const DAMAGE = 'damage';

import { curveToLine, lineToLine } from '$lib/game/core/2d/utils/intersections';

class Droplet extends Model {
    constructor(options) {
        super(options);
        this.actions = [];
        this.body.id = `${this.type}_${this.index}`;
        this.falling = false;
        this.shot = false;
        this.didDamage = false;
        this.history = [];
        this.trail = []; 
        this.slotID = null;

        if (!this.size) {
            this.size = {
                width: this.body.bounds.max.x - this.body.bounds.min.x,
                height: this.body.bounds.max.y - this.body.bounds.min.y
            };
        }
        this.$listen({
            game: ['reset', 'over', 'start']
        });
        this.update();
        return this;
    }

    filter_position() {
        const {screen, stage} = this.app;

        return {
            x: screen.width / 2,
            y: screen.height * -0.25
        };
    }

    update() {
        super.update();

        if (this.shot) {
            this.trail.unshift({
                position: {x: this.body.position.x, y: this.body.position.y},
                speed: this.body.speed
            });

            if (this.trail.length > 2000) {
                this.trail.pop();
            }
        }

    }

    startFallingAt(cell, slotID) {
        const {body, model} = this;
        Body.setStatic(body, false);
        Body.setPosition(body, {
            x: Math.between(cell.x[0], cell.x[1]),
            y: Math.between(cell.y[0], cell.y[1])
        });
        Body.setAngle(body, 0);

        this.slotID = slotID;
        this.falling = true;
        model.visible = true;
        this.update();
    }
    
    game_reset() {
        this.stops(DAMAGE);
        this.$emit('damage_stoped', this);
        this.reset();
    }
    
    game_start() {
        const {body, model, position} = this;
        Body.setStatic(body, false);
        this.falling = true;
    }

    reset() {
        const {body, model, position} = this;

        Body.setStatic(body, true);
        Body.setPosition(body, position);
        this.falling = false;
        this.slotID = null;
        this.shot = false;
        this.didDamage = false;
        this.trail = [];
        model.visible = true;
        this.update();

        this.$emit('droplet_reset');
    }

    scan(ifOutside) {
        const {app, body, size, bounds} = this;
        if (this.falling) {
            const inside = Bounds.overlaps(bounds, body.bounds);

            let outside = null, ray = null, line;

            if (body.position.y > (app.screen.height + size.height / 2)) {
                outside = BELLOW;

                ray = {
                    ax: 0,
                    ay: app.screen.height,
                    bx: app.screen.width,
                    by: app.screen.height
                };
            } else if ((body.position.y < (-size.height / 2)) && (this.shot)) {
                outside = ABOVE;
                ray = {
                    ax: 0,
                    ay: 0,
                    bx: app.screen.width,
                    by: 0
                };
            } else if (body.position.x < -size.width / 2) {
                outside = LEFT;
                ray = {
                    ax: 0,
                    ay: 0,
                    bx: 0,
                    by: app.screen.height
                };
            } else if (body.position.x > (app.screen.width + size.width / 2)) {
                outside = RIGHT;
                ray = {
                    ax: app.screen.width,
                    ay: 0,
                    bx: app.screen.width,
                    by: app.screen.height
                };
            }

            if ((this.trail.length > 0) && ray) {

                line = {
                    ax: body.position.x,
                    ay: body.position.y,
                    bx: app.screen.width / 2,
                    by: app.screen.height / 2
                };

                const at = lineToLine(line.ax, line.ay, line.bx, line.by, ray.ax, ray.ay, ray.bx, ray.by);
                this.$emit('droplet_outside', this, outside, at);



            }

            if (outside) {
                ifOutside(this);

                this.reset();
            }
            
            this.scanDamage();

        }
    }
    
    scanDamage() {
        const {body, ground} = this;
        
        const group = ground.getHoldingBricks();
        const collissions = Query.collides(body, [ground.body]);

        if (collissions.length > 0) {
            if (this.doesnt(DAMAGE)) {
                this.starts(DAMAGE);
                this.$emit('damage_started', this);
            }
            
        } else {
            if (this.does(DAMAGE)) {
                this.stops(DAMAGE);
            }
            
            this.$emit('damage_stoped', this);
        }
        
        
    }
    
    scanOutside() {
        
    }

    isNotFalling() {
        return !this.falling;
    }

    createModel() {
        const droplet = new Graphics;
        const {position} = this;

        droplet.position.set(position.x, position.y);
        droplet.beginFill(0x558855, 0.1);
        droplet.lineStyle(2, 0x11FA93);
        this.drawShape(droplet);
        droplet.endFill();

        return droplet;

    }

    drawShape(droplet) {

    }

    isOnScreen() {
        const {body, bounds} = this;
        return Bounds.overlaps(body.bounds, bounds) && (body.position.y < this.app.screen.height);
    }

    isOffScreen() {
        return false === this.isOnScreen();
    }

    isWayTooHigh() {

    }

}
;

export default Droplet;