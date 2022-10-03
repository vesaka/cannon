<template>
    <div>
        <div ref="container" class="flex relative inset-0 w-full h-full justify-center items-center"></div>
    </div>
</template>
<script>
    import CannonGame from '../cannon-game';
    import PixiMixin from '$lib/game/core/2d/mixins/pixi-mixin';
    import options from '../config/options.json';
    import settings from '../config/settings.json';
    import assets from '../config/assets.json';
    export default {
        mixins: [PixiMixin],     
        mounted() { 
            const {container, $store} = this;
            this.game = new CannonGame({
                container,
                options: $store.state.options,
                settings: $store.state.settings,
                assets,
                $store });
            this.game.load();
        },
        beforeUnmount() {
            //this.container.removeChild(this.container.querySelector('canvas'));
            this.game.destroy();
            this.game = null;
        }
    }
</script>
<style>
    nav {position: fixed}
</style>
