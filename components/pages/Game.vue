<template>
    <div>
        <div ref="container" class="flex relative w-full h-screen justify-center items-center origin-centero"></div>
    </div>
</template>
<script setup>
    import { ref, onMounted, onBeforeUnmount } from 'vue';
    import CannonGame from '$cn/cannon';
    import options from '$cn/config/options.json';
    import settings from '$cn/config/settings.json';
    import assets from '$cn/config/assets.json';
    import { useGameStore } from '$cn/bootstrap/stores';

    const container = ref(null);
    let game = null;

    onMounted(() => {
        game = new CannonGame({
                container: container.value,
                options, settings, assets,
                $store: useGameStore() 
        });

        game.load();
    });

    onBeforeUnmount(() => {
        if (game) {
            game.destroy();
            game = null;
        }
        
    });



</script>