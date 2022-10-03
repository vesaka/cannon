import Toggle from './toggle';
//import { sound } from '@pixi/sound';

class Sound extends Toggle {
    constructor(options = {}) {
        super(options);
        this.$listen({
            audio: ['loaded']
        });
        return this;
    }
        
    sound_loaded(asset) {
        this.sprite_loaded(asset);        
    }
    
    sound_on(ev, name) {
        this.changeState();
        this.audio.pause();
    }
    
    sound_off(ev, name) {
        this.changeState();
        this.audio.resume();
    }
    
    audio_loaded(asset) {
        this.audio = asset.sound;
        
        if ('on' === this.settings.audio) {
            this.audio.play();
        }
        
    }
    

    
};

export default Sound;