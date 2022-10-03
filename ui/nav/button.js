import UI from '$lib/game/core/2d/display/ui';
import { Container, Text } from 'pixi.js';

class Button extends UI {
    constructor(options) {
        super(options);
        this.$name = this.constructor.name.toLowerCase();
        return this;
    }
    
    filter_size(size) {
        return {
            width: this.app.screen.width * size.width,
            height: this.app.screen.height * size.height,
        };
    }
    
    filter_position(position) {
        return {
            x: this.app.screen.width * position.x,
            y: this.app.screen.height * position.y
        };
    }
    
    
    
};

export default Button;