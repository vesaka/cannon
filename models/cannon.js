import Model from '$lib/game/core/2d/models/matter-model';
import { Graphics, Point } from 'pixi.js';
import { Body, Bodies, Vertices, Vector } from 'matter-js';

import Bullet from './projectiles/bullet';
import Beam from './projectiles/beam';
import Bomb from './projectiles/bomb';

const ammo = {bullet: Bullet, beam: Beam, bomb: Bomb};

const TO_LEFT = 'to_left';
const TO_RIGHT = 'to_right';
let $this = null;
class Cannon extends Model {

    constructor(options) {
        super(options);
        this.actions = [];
        this.projectiles = {};
        
        this.loadAmmo();
        document.addEventListener('keydown', this.onKeyDown, false);
        document.addEventListener('keyup', this.onKeyUp,false);
        this.app.stage.on('pointerdown', this.onPointerDown, false);
        this.app.stage.on('pointerup', this.onPointerUp,false);
        this.updatePosition();
        
        this.$listen({
            bullet: ['loading'],
            droplet: ['outside'],
            game: ['destroy', 'over', 'reset']
        });
        
        this.zeroVector = Vector.create(0, 0);
        this.shooting = false;
        $this = this;
        return this;
    }
    
    loadAmmo() {
        
        const {options} = this;
        const types = options.models.projectiles.types;
        this.firstAmmo = Object.keys(types)[0];
        for (let type in types) {
            if (ammo[type]) {
                
                if (!this.projectiles[type]) {
                    this.projectiles[type] = [];
                }
                
                const settings = Object.assign({
                    position: { x: this.body.position.x, y: this.model.position.y + 5} 
                }, options.models.projectiles.default, types[type]);
                for (let i = 0; i < settings.max; i++) {
                    settings.index = i;
                    const projectile = new ammo[type](settings);
                    this.projectiles[type].push(projectile);
                    
                }
                
            }
        }
    }
    
    loopProjectiles(callback) {
        const {options, projectiles} = this;
        
        for (let type in  projectiles) {
            for (let i in projectiles[type]) {
                callback(projectiles[type][i]);
            }
        }
    }

    getPoints() {
        const {position, size, vertices} = this;
        if (!this.points) {
            this.points = [];
            for (let i in vertices) {
                this.points.push(new Point(
                        (size.width * vertices[i][0]),
                        (size.height * vertices[i][1]))
                );
            }
        }
        
        return this.points;
    }

    filter_position() {
        const {app, ground, size} = this;
        return {
            x: app.screen.width / 2,
            y: Math.round(ground.body.position.y - ground.model.height)
        };
    }

    createModel() {
        const cannon = new Graphics;
        const {position, size} = this;

        cannon.beginFill(0x558855);
        cannon.lineStyle(2, 0x11FA93);
        cannon.drawPolygon(this.getPoints());
        cannon.endFill();
        cannon.position.set(position.x, position.y);
        cannon.pivot.set(size.width/2, size.height/2);
        return cannon;

    }

    createBody() {
        const {position, size, matter} = this;
        const points = this.getPoints();

        return Bodies.fromVertices(position.x, position.y, points, matter);
    }
    
    onKeyDown(ev) {
        const code = (typeof ev.which === "number") ? ev.which : ev.keyCode;
        const {body, model, app, options, speed, size} = $this;

        if ([37, 65].indexOf(code) > -1) {
            $this.stops(TO_RIGHT);
            $this.starts(TO_LEFT);
        } else if([39, 68].indexOf(code) > -1) {
            $this.stops(TO_LEFT);
            $this.starts(TO_RIGHT);
        } else if ([32, 38, 87].indexOf(code) > -1) {
            $this.shooting = true;
        }
        
    }
    
    update() {
        let newX = null;
        const {body, options, speed} = this;
        if (this.does(TO_LEFT)) {
            newX = Math.max(options.world.offset, body.position.x - speed);
        } else if(this.does(TO_RIGHT)) {
            newX = Math.min(this.app.screen.width - options.world.offset, body.position.x + speed);
        }

        if (newX) {
            Body.setPosition(body, {
                x: newX,
                y: body.position.y
            });
            
            this.$emit('cannon_move', this);
        }
        
        if (this.shooting) {
            this.shoot();
        }
        
        super.update();
    }
    
    onKeyUp(ev) {
        const code = (typeof ev.which === "number") ? ev.which : ev.keyCode;
        if ([32, 38, 87].indexOf(code) > -1) {
            $this.shooting = false;
        } else if ([37, 65].indexOf(code) > -1) {
            $this.stops(TO_LEFT, TO_RIGHT);
        } else if ([39, 68].indexOf(code) > -1) {
            $this.stops(TO_RIGHT, TO_LEFT);
        }
    }
    
    
    onPointerDown(ev) {
        $this.shooting = true;
        //if (ev.touches.length === 1) {

            $this.starts(($this.app.screen.width / 2) <= ev.data.global.x ? TO_RIGHT : TO_LEFT);
        //}
    }
    
    onPointerUp() {
        $this.shooting = false;
        $this.stops(TO_LEFT, TO_RIGHT);
    }
    
    moveLeft() {
        
    }
    
    moveRight() {
        
    }
    
    shoot(projectile = null) {
        const { options, projectiles } = this;
        const types = Object.keys(options.models.projectiles.types);
        if (types.indexOf(projectile) === -1) {
            projectile = types[0];
        }
        
        const group = projectiles[projectile];
        let index = 0;
        for (let i in group) {
            if (group[i].isLoaded()) {
                index = i;
                
                break;
            }
        }
        
        group[index].launch();
        this.$emit('cannon_shoot', group[index]);
        
        
    }
    
    bullet_loading(bullet) {
        Body.setPosition(bullet.body, {
            x: this.body.position.x,
            y: this.body.position.y + 5
        });
    }
    
    droplet_outside(droplet, outside, at) {
        if (this.scores[outside]) {
            const {app} = this;
            const score = this.scores[outside] * droplet.score;
            
            this.$emit('cannon_scores', score, at);
        }
        
    }
    
    game_destroy() {
        this.$clear();
        document.removeEventListener('keydown', this.onKeyDown, false);
        document.removeEventListener('keyup', this.onKeyUp, false);
    }
    
    game_over() {
        //Body.setStatic(this.body, false);
    }
    
    game_reset() {
        const { body, model, position } = this;
        Body.setStatic(body, true);
        Body.setAngularVelocity(body, 0);
        Body.setVelocity(body, this.zeroVector);
        this.setPosition(position.x, position.y);
        this.rotate(0);
        
        this.$emit('cannon_move', this);
    }
}
;

export default Cannon


