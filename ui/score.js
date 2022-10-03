import UI from '$lib/game/core/2d/display/ui';
import { Container, Text } from 'pixi.js';

class Score extends UI {
    
    constructor(options) {
        super(options);
        this.$listen({
            cannon: ['scores'],
            game: ['clear']
        });
        
        this.label = this.createLabel(options.score.label);
        this.counter = this.createCounter(options.score.counter);
        
        const point = this.filter_position(options.score.position);
        this.box = new Container;
        this.box.position.x = point.x;
        this.box.position.y = point.y;
        this.box.addChild(this.counter);
        this.box.addChild(this.label);

        this.score = 0;
        return this;
    }
    
    filter_position(point) {

        return {
            x: this.app.screen.width * point.x,
            y: this.app.screen.height * point.y
        };
    }
    
    cannon_scores(score, outside) {
        if (typeof score === 'number') {
            this.counter.text = parseInt(this.counter.text) + score;
            this.$emit('score_added', outside);
        }
    }
    
    createCounter(setup) {
        const counter = this.createText(0, setup.style);
        counter.position.x = 200;
        counter.anchor.set(1, 0);
        return counter;
    }
    
    createLabel(setup) {
        const text = this.createText(this.$store.state.i18n.ui.score + ':', setup.style);
        
        return text;
    }
    
    game_clear() {
        this.counter.text = 0;
    }
};

export default Score;

