import GameMatter from '$core/2d/game-matter';
import { Texture, Container, TilingSprite } from 'pixi.js';
import { Bounds, Vertices, Runner } from 'matter-js';

import { main as mainEvents, game } from '$cn/config/events';

import Ground from './models/ground';
import Cannon from './models/cannon';
import Droplets from './models/droplets/droplets';
/** UI Imports */
import Score from './ui/score';
import PopupPoints from './ui/popup-points';
import NavBar from './ui/nav/bar';

import GameStart from './ui/screens/game-start';
/** Mixins */
import ActionsMixin from '$core/mixins/actions-mixin';
class CannonGame extends GameMatter {
    
    
    constructor(options) {
        super(options);
        this.$listen(mainEvents);
        this.$listen(game);
        this.$set('style', this.options.ui);

        this.$set('scene', new Container());
        this.$set('ui', new Container());
        this.$set('gameOver', false);
        
        this.ui.interactive = false;
        this.scene.interactive = true;
        
        this.app.stage.addChild(this.scene);
        this.app.stage.addChild(this.ui);
                
        this.addLayer('bullet', 'cannon');
        const navBar = new NavBar(this.options.ui.nav);
        this.addLayer('screen');
        navBar.render();
        this.pause = true;
        
        return this;
    }
    
    game_start() {
        this.pause = false;
        this.$set('gameOver', false);
    }
    
    game_over() {
        this.$set('gameOver', true);
        
    }
    
    build() {
        const { app, options, runner } = this;
        
        this.createUI();
        
        this.createModels();
        
        window.addEventListener('keydown', (ev) => {
            const code = (typeof ev.which === "number") ? ev.which : ev.keyCode;
            
            if (32 === code) {
                this.pause = !this.pause;
                if (this.pause) {
                    Runner.stop(runner);
                } else {
                    Runner.start(runner, this.engine);
                }

            }
        });
        
        
        //this.$emit('game_over');
        app.ticker.add((delta) => {
            //console.log(this.pause);
            if (this.pause) {
                return;
            }
            
            this.cannon.update();
            this.cannon.loopProjectiles(projectile => {
                projectile.update();
            });
            this.droplets.update();
        });
        Runner.start(runner, this.engine);
        
        
        
//        setTimeout(() => {
//            this.gameEnd.close();
//        }, 3000);
    }
    
    createUI() {
        /** Add UI elements */
        const { app, options, runner } = this;
        Score.setDefaultStyle(options.ui.style);
        const score = new Score(options.ui);
        const popupPoints = new PopupPoints(options.ui);
        const gameStart = new GameStart(Object.assign(
                {},
                options.ui.screens.default,
                options.ui.screens.game_start)
        );

        gameStart.show();
//        
//        setTimeout(() => {
//            app.ticker.start();
//        }, 3000);
        this.ui.addChild(score.box);
    }
    
    createModels() {
        const { app, options, runner } = this;
        this.$set('ground', new Ground(options.models.ground));
        this.$set('bounds', Bounds.create(Vertices.create([
            {x: options.world.offset, y: 0},
            {x: app.screen.width, y: 0},
            {x: options.world.offset, y: app.screen.height},
            {x: app.screen.width - options.world.offset, y: app.screen.height}
        ])));
        this.ground.eachBrick(brick => {
            this.add(brick);
        });
        
        options.models.cannon.mixins = [ActionsMixin];        
        const cannon = new Cannon(options.models.cannon);
        
        this.$set('cannon', cannon);
        
        const droplets = new Droplets(options.models.droplets);
        
        droplets.items.map(droplet => {
            this.add(droplet);
        });
        
        this.droplets = droplets;
        
        this.add(this.ground);
        this.add(cannon, 'cannon');
        
        cannon.loopProjectiles(projectile => {
            this.add(projectile, projectile.type);
        });
    }
    
};

export default CannonGame;