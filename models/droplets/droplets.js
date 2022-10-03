import Collection from '$lib/game/core/models/collection';

import Circle from './circle';
import Rect from './rect';
import Polygon from './polygon';
import Rock from './rock';
import Star from './star';

import Grid from '$lib/game/core/2d/utils/grid';

import { Query, Events, Bounds } from 'matter-js'; 
import ActionsMixin from '$lib/game/core/mixins/actions-mixin';
const types = {
    circle: Circle,
    rect: Rect,
    polygon: Polygon,
    rock: Rock,
    star: Star
};
class Droplets extends Collection {
    constructor(options) {
        super(options);
        this.setup();
        this.$listen({
            projectile: ['launched'],
            game: ['reset', 'start', 'over']
        });
        return this;
    }
    
    setup() {
        const grid = new Grid(Object.assign({}, this.options.models.droplets));
        const { items } = this;
        grid.arrange((preset, type, i) => {
            if (types[type]) {
                preset.type = type;
                preset.index = i;
                preset.mixins = [ActionsMixin];
                items.push(new types[type](preset));
            }
        });
        this.grid = grid;
    }
    
    update() {
        const {grid, limit, bounds, app, items} = this;
        for (let i in items) {
            const droplet = items[i];
//            console.log({
//                notFalling: !droplet.falling,
//                hasFreeSlots: (grid.freeSlots.length > 0),
//                hasAvilableSlots: grid.takenSlots.length < limit,
//                chanse: droplet.odd
//            });
            if (!droplet.falling && (grid.freeSlots.length > 0) && (grid.takenSlots.length < limit) && (Math.random() > droplet.odd)) {
                const id = Math.round(Math.between(0, grid.freeSlots.length - 1));
                const cell = grid.getCell(id);

                grid.bookSlot(id);
                droplet.startFallingAt(cell, id);
                break;
            }
            
            droplet.update();
        }
        
        for (let i in items) {
            const droplet = items[i];
            droplet.scan(() => {
                grid.releaseSlot(droplet.slotID);
            });
        }
    }
    
    drawShape() {
        
    }
    
    getBodies() {
        return this.map(item => { return item.body; });
    }
    
    projectile_launched(projectile) {
        const {bounds} = this;
        const droplets = this.items.filter(item => {
            return Bounds.overlaps(bounds, item.body.bounds) && (true === item.falling) && (false === item.shot);
        });
               
        const collisions = Query.collides(projectile.body, droplets.map(droplet => { return droplet.body;}));
        
        if (collisions.length > 0) {
            for (let i in collisions) {
                
                droplets.forEach(droplet => {
                    if (droplet.body.id === collisions[i].bodyB.id) {
                        droplet.shot = true;
                    }
                });
            }
        }
        //
    }
    
    game_reset() {
        this.grid.realeaseAllSlots();
    }
    
    
};

export default Droplets;