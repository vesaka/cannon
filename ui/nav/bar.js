import UI from '$lib/game/core/2d/display/ui';
import { Container, Text, Graphics } from 'pixi.js';
import Fullscreen from './fullscreen';
import Sound from './sound';

class Bar extends UI {
    constructor(options) {
        super(options);
        
        
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
    
    render() {
        const {position, size} = this;
        const box = new Graphics;    
        
        
        const fullscreen = new Fullscreen(Object.assign({
            size: {
                width: this.size.height,
                height: this.size.height
            },
            parent: box
        }, this.default, this.buttons.fullscreen));
        
        const sound = new Sound(Object.assign({
            size: {
                width: this.size.height,
                height: this.size.height
            },
            parent: box
        }, this.default, this.buttons.sound));
        
        this.ui.addChild(box);
        this.box = box;
        

    }
    
    
    
};

export default Bar;