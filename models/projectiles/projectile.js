import Model from '$lib/game/core/2d/models/matter-model';
import { Graphics, Point } from 'pixi.js';
import { Body, Bounds, Sleeping, Query, Events } from 'matter-js';

const LOADING = 'loading';
const LOADED = 'loaded';
const LAUNCHED = 'launched';
const states = [LOADING, LOADED, LAUNCHED];
class Projectile extends Model {
    constructor(options) {
        super(options);
        this.$listen({
            cannon: ['move'],
            game: ['reset']
        });
        return this;
    }
    
    filter_state(state) {
        if (states.indexOf(state) > -1) {
            return state;
        }
        
        return states[0];
    }
    
    setState(state) {
        this.state = this.filter_state(state);
    }
    
    hits() {
        
    }
    
    launch() {
        this.setState(LAUNCHED);
        this.$emit(`${this.$name}_${LAUNCHED}`, this);
    }
    
    load() {
        this.setState(LOADED);
        this.$emit(`${this.$name}_${LOADED}`, this);
        
        
    }
    
    restore() {
        this.setState(LOADING);
        this.$emit(`${this.$name}_${LOADING}`, this);
        
        const {body} = this;
        Body.setVelocity(body, {x: 0, y: 0});
        Body.setStatic(body, true);
        Sleeping.set(body, true);
        
    }
    
    update() {
        super.update();
        
        const action = `when_${this.state}`;
        this[action]();
        
        this.$emit(`projectile_${this.state}`, this);
    }
    
    when_loaded() {
        
    }
    
    when_loading() {
        
    }
    
    when_launched() {
        if (this.isLaunched() && !Bounds.overlaps(this.bounds, this.body.bounds)) {
            this.restore();
        }

    }
    
    isLoading() {
        return LOADING === this.state;
    }
    
    isLoaded() {
        return LOADED === this.state;
    }
    
    isLaunched() {
        return LAUNCHED === this.state;
    }
    
    
    
    cannon_move(cannon) {
        
        if ([LOADING, LOADED].indexOf(this.state) > -1) {
             Body.setPosition(this.body, {
                 x: cannon.body.position.x,
                 y: cannon.body.position.y + 5
             });
             
             this.update();
        }
    }
    
    game_reset() {
       // this.restore();
        //this.update();
    }
    
};

export default Projectile;

