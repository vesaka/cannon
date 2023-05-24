<template>
    <div class="flex flex-col h-full">
        <router-view class="flex flex-grow h-full"></router-view>
    </div>
</template>
<script setup>

import { setLocales } from '$core/utils/i18n';
import en from './assets/i18n/en.json';

setLocales({ en });
</script>