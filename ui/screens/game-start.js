import Screen from './screen';
import { Graphics, Text } from 'pixi.js';
import { BounceDown } from '$core/utils/transitions';
import { t } from '$core/utils/i18n';
class GameStart extends Screen {
    constructor(options = {}) {
        super(options);
        this.createStartButton();
        
        //this.screen.position.y = 600;
        //this.$name = 'start';
        this.$listen({
            game: ['over', 'reset']
        });
        return this;
    }
    
    createHeader() {
        return new Text(t('ui.popups.game_start.header'), this.style);
    }
    
    createStartButton() {
        const button = new Graphics;
        const {position, size} = this.buttons.start;
        button.beginFill(0x005599, 0.5);
        button.drawRect(0, 0, this.box.width*size[0], this.box.height*size[1]);
        button.position.set(this.box.width*position[0]/2, this.box.height*position[1]);
        button.endFill();
        //button.pivot.set(0.5);
        button.interactive = true;
        button.buttonMode = true;
        
        const text = new Text(t('ui.popups.game_start.play'), this.style);
        text.position.set(button.width * 0.5, button.height * 0.5)
        text.anchor.set(0.5, 0.5);
        button.addChild(text);
        
        button.on('pointerup', () => {
            this.$emit('game_start');
            this.close();
        });
        this.box.addChild(button);
    }
    
//    triggerStart() {
//        this.$emit('game_start');
//        this.close();
//    }
    
    game_over() {
        this.show();
        this.$emit('game_reset');
    }

};

export default GameStart;