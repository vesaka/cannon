<template>
    <div class="p-2">
        <div class="flex h-8 items-center text-left">
            <slot name="title"><span v-html="title"></span></slot>
        </div>
        <slot></slot>
    </div>
</template>
<script>
    export default {
           data() {
               return {};
           },
           props: {
               title: String
           },
           
    }
</script>