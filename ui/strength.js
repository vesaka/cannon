import UI from '$lib/game/core/2d/display/ui';
import { Text } from 'pixi.js';

class Strength extends UI {
    
    constructor(options) {
        super(options);
        this.$listen({
            droplet: ['ravages']
        });
        return this;
    }
    
    cannon_scores(score) {
        if (typeof score === 'function') {
            score = score();
        }
    }
};

export default Strength;

