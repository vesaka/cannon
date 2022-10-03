import Screen from './screen';
import { Graphics, Text } from 'pixi.js';

class GameEnd extends Screen {
    constructor(options = {}) {
        super(options);
        

        return this;
    }
    
    createHeader() {
        return new Text(this.i18n('ui.popups.game_over.header'), this.style);
    }
    
    createRestartButton() {
        const button = new Graphics;
        const {position, size} = this.buttons.restart;
        button.beginFill(0x005599, 0.5);
        button.drawRect(0, 0, this.box.width*size[0], this.box.height*size[1]);
        button.position.set(this.box.width*position[0]/2, this.box.height*position[1]);
        button.endFill();
        //button.pivot.set(0.5);
        button.interactive = true;
        button.buttonMode = true;
        
        const text = new Text(this.i18n('ui.popups.game_start.replay'), this.style);
        text.position.set(button.width * 0.5, button.height * 0.5)
        text.anchor.set(0.5, 0.5);
        button.addChild(text);
        
        button.on('pointerup', () => {
            this.close();
        });
        this.box.addChild(button);
    }
    
    show() {
        this.createRestartButton();
        this.tween();
    }
    
    close() {
        this.tween(-1);
    }
};

export default GameEnd;