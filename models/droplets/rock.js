import Droplet from './droplet';
import { Graphics } from 'pixi.js';
import { Body, Bodies } from 'matter-js';
import { between } from '$core/utils/math';

import Matrix from '$core/2d/grids/matrix';

class Rock extends Droplet {
    constructor(options) {
        super(options);
        return this;
    }

    getPoints() {
        if (!this.points) {
            
        
            const {grid, range, position} = this;
            const [min, max] = [-10000, 10000];
            
            const bounds = {
                min: {
                    x: 10000,
                    y: 10000
                },
                max: {
                    x: -10000,
                    y: -10000
                }
            };
            const matrix = new Matrix({
                rows: Math.round(between(grid[0], grid[1])),
                columns: Math.round(between(grid[0], grid[1])),
                width: between(range[0], range[1]),
                height: between(range[0], range[1])
            });
            const [rows, columns] = [grid.rows - 1, grid.columns - 1];
            const points = [];
            matrix.eachEdgeSlot(slot => {
                const {x, y} = slot;

                if (!(((0 === x) && (0 === y))
                        || ((0 === x) && (columns === y))
                        || ((rows === x) && (0 === y))
                        || ((rows === x) && (columns === y)))) {
                    const point = {
                        x: Math.round(between(slot.ax, slot.bx)),
                        y: Math.round(between(slot.ay, slot.dy))
                    };
                    
                    if (point.x < bounds.min.x) {
                        bounds.min.x = point.x;
                    }
                    
                    if (point.x > bounds.max.x) {
                        bounds.max.x = point.x;
                    }
                    
                    if (point.y < bounds.min.y) {
                        bounds.min.y = point.y;
                    }
                    
                    if (point.y > bounds.max.y) {
                        bounds.max.y = point.y;
                    }
                    points.push(point);
                }
            });
            points.push(points[0]);
            this.size = {
                width: bounds.max.x - bounds.min.x,
                height: bounds.max.y - bounds.min.y
            };
            
            points.forEach(point => {
                point.x -= bounds.min.x;
                point.y -= bounds.min.y;
            }) ;
            this.points = points;
            
        }
        


        return this.points;
    }

    drawShape(droplet) {
        const points = this.getPoints();
        
        droplet.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
            droplet.lineTo(points[i].x, points[i].y);
        }
        droplet.pivot.set(this.size.width/2, this.size.height/2);
        droplet.position.set(this.position.x, this.position.y);
    }

    createBody() {
        const {position, matter} = this;
        const points = this.getPoints();
        return Bodies.fromVertices(position.x, position.y, points, matter, true);
    }
}
;

export default Rock;