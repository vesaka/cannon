import UI from '$lib/game/core/2d/display/ui';
import { Text, Graphics } from 'pixi.js';

import { curveToLine, pointInRectangle, curveToRectangle } from '$lib/game/core/2d/utils/intersections';
import Matrix from '$core/2d/grids/matrix';
class PopupPoints extends UI {
    constructor(options) {
        super(options);
        this.$listen({
            cannon: ['scores']
        });
        
        const setup = options.popup_points;
        setup.matrix.width = this.app.screen.width;
        setup.matrix.height = this.app.screen.height;
        this.grid = new Matrix(setup.matrix);
        
        this.grid.eachSlot((slot, x, y) => {
            if ((slot.x > 0) && (slot.x < setup.matrix.rows- 1) && (slot.y > 0) && (slot.y < setup.matrix.columns - 1)) {
                slot.available = false;
            }
            const cell = new Graphics;
            cell.beginFill('#FF3311', 0.3);
            cell.lineStyle(2, 0xFF3311, 0.2);
            cell.drawRect(0, 0, slot.width, slot.height);
            cell.endFill();
            cell.position.set(slot.ax, slot.ay);
            
            //this.ui.addChild(cell);
        });
        return this;
    }
    
    cannon_scores(score, at) {
        
        const point = {
            x: Math.round(Math.abs(at.x)),
            y: Math.round(Math.abs(at.y))
        };
        const slot = this.grid.firstSlot(slot => {
            return pointInRectangle(point, slot);
        });
        
        
        if (slot && slot.available) {
            slot.available = false;
            const position = {
                x: (slot.ax + slot.width/2),
                y: (slot.ay + slot.height/2)
            };

console.log(position);
            const text = new Text(`+${score}`, this.style);
            text.position.set(position.x, position.y);
            text.anchor.set(0.5, 0.5);
            this.ui.addChild(text);
            
            setTimeout(() => {
                this.ui.removeChild(text);
                slot.available = true;
            }, this.popup_points.duration);
        }
        

    }
    
    
}

export default PopupPoints;
