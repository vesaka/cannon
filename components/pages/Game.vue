<template>
    <div>
        <div ref="container" class="flex relative inset-0 w-full h-full justify-center items-center"></div>
    </div>
</template>
<script>
    import CannonGame from '$cn/cannon';
    import PixiMixin from '$core/2d/mixins/pixi-mixin';
    import options from '$cn/config/options.json';
    import settings from '$cn/config/settings.json';
    import assets from '$cn/config/assets.json';
    import { useGameStore } from '$cn/bootstrap/stores';
    export default {
        mixins: [PixiMixin],     
        mounted() { 
            const {container} = this;
            this.game = new CannonGame({
                container,
                options, 
                settings,
                assets,
                $store: useGameStore() });
            this.game.load();
        },
        beforeUnmount() {
            this.game.destroy();
            this.game = null;
        }
    }
</script>