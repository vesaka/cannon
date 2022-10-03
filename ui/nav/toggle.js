import UI from '$lib/game/core/2d/display/ui';
import { Container, Text, Texture, Sprite } from 'pixi.js';

const ON = 'on';
const OFF = 'off';
const LOADED = 'loaded';

class Toggle extends UI {
    constructor(options) {
        super(options);
        this.$name = this.constructor.name.toLowerCase();
        this.sprites = {};
        this.state = [ON, OFF].indexOf(options.state) > -1 ? options.state : OFF;
        
        const events = {};
        events[this.$name] = ['loaded', 'on', 'off'];
        
        this.$listen(events);
        return this;
    }
    
    setState(state) {
        this.state = [ON, OFF].indexOf(state) > -1 ? state : OFF;
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
    
    sprite_loaded(asset) {
        const {size, position} = this;
        const texture = Texture.from(asset.url);
        const sprite = new Sprite(texture);
        const name = asset.key.replace(this.$name + '_', '');
        sprite.position.set(position.x, position.y);
        sprite.width = size.width;
        sprite.height = size.height;
        sprite.visible = this.state === name;
        sprite.interactive = true;
        sprite.buttonMode = true;
        this.parent.addChild(sprite);
        
        sprite.on('pointerup', ev => { ev.stopped = true; ev.stopPropagation(); return false;});
        sprite.on('pointerdown', ev => { this.$emit(asset.name, ev);  return false;});
        
        this.sprites[name] = sprite;
    }
    
    changeState() {
        if (OFF === this.state) {
            this.sprites.on.visible = false;
            this.sprites.off.visible = true;
            this.state = ON;
        } else if (ON === this.state) {
            this.sprites.off.visible = false;
            this.sprites.on.visible = true;
            this.state = OFF;
        }
    }
    
    enabled() {
        return ON === this.state;
    }
    
    disabled() {
        return OFF === this.state;
    }
    
    
    
};

export default Toggle;