import Droplet from './droplet';
import { Graphics } from 'pixi.js';
import { Body, Bodies, Common } from 'matter-js';


class Star extends Droplet {
    constructor(options) {
        super(options);
//        this.beams = 5;
//        this.depth = 10;
//        this.radius = 5;
//        this.angle = 0;
        
        if (!this.angle) {
            this.angle = 0;
        }
        
        
        return this;
    }
    
    filter_radius(radius) {
        return Math.round(Math.between(radius[0], radius[1]));
    }
    
    filter_beams(beams) {
        return Math.round(Math.between(beams[0], beams[1]));
    }

    getPoints() {
        if (!this.points) {
            const len = this.beams * 2;
            const div = 360 / len;
            const points = [];
            const angle = this.angle || 0;
            const depth = this.depth || 5;
            for (let i = 1, c = 0; i <= 360; i += div, c++) {
                const radius = (c % 2) !== 0 ? this.radius : (this.radius * depth);
                points.push({
                    x: this.radius + Math.round((Math.cos(Math.radians(i - 90 + angle)) * radius), 2),
                    y: this.radius + Math.round((Math.sin(Math.radians(i - 90 + angle)) * radius), 2)
                });
            }
            points.push(points[0]);
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
        droplet.pivot.set(this.radius, this.radius);
        droplet.position.set(this.position.x, this.position.y);
    }

    createBody() {
        const {position, matter, radius} = this;
        const points = this.getPoints();
        return Bodies.fromVertices(position.x - this.radius, position.y - this.radius, points, matter, true);
    }

}
;

export default Star

