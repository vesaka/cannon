import Droplet from './droplet';
import { Graphics } from 'pixi.js';
import { Body, Bodies } from 'matter-js';
import { between } from '$core/utils/math';

class Polygon extends Droplet {
    constructor(options) {
        super(options);
        this.points = [];
        
        return this;
    }
    
    filter_edges(edges) {
        return Math.round(between(edges[0], edges[1]));
    }

    drawShape(droplet) {
        const {position, radius, edges, angle} = this;

        const R = Math.round(between(radius[0], radius[1]));
        this.points = [];
        let step = (Math.PI * 2) / edges;
        let start = (Math.round(between(angle[0], angle[1]) / 180)) * Math.PI;
        let n, dx, dy;

        for (n = 0; n <= edges; n++) {
            dx = Math.cos(start + (step * n)) * R;
            dy = Math.sin(start + (step * n)) * R;
            this.points.push({
                x: dx,
                y: dy
            });
            
        }

        droplet.position.set(position.x, position.y);
        
        droplet.drawPolygon(this.points);
    }

    createBody() {
        const {position, model, matter, points, edges, R} = this;
//        return Bodies.polygon(
//                position.x + model.width / 2,
//                position.y + model.height / 2,
//                edges, R, matter);
        return Bodies.fromVertices(
                model.position.x + model.width / 2,
                model.position.y + model.height / 2,
                points,
                matter
                );
    }
}
;

export default Polygon;