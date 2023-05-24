import Button from './button';
import Toggle from './toggle';
import { Container, Text, Texture, Sprite } from 'pixi.js';
import { toggleFullscreen } from '$core/utils/fullscreen';

class Fullscreen extends Toggle {
    constructor(options) {
        super(options);

        return this;
    }    
    
    fullscreen_loaded(asset) {
        this.sprite_loaded(asset);        
    }
    
    fullscreen_on(ev, name) {
        this.changeState();
        toggleFullscreen(this.app.view.parentNode);
    }
    
    fullscreen_off(ev, name) {
        this.changeState();
        toggleFullscreen(this.app.view.parentNode);
    }
    
    
};

export default Fullscreen;