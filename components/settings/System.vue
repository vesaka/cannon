<template>
    <panel :key="key">
        <template v-slot:title><h3 v-html="_i18n('title')"></h3></template>
        <form-group v-if="false">
            <template v-slot:label>
                <div class="flex items-center" v-html="_i18n('debug')"></div>
            </template>
            <toggle v-model:checked="settings.debug" :classes="wrapperClasses"></toggle>
        </form-group>
        <form-group>
            <template v-slot:label>
                <div class="flex items-center" v-html="_i18n('fps')"></div>
            </template>
            <toggle v-model:checked="fps" :classes="wrapperClasses">
                <template v-slot:center><div class="flex items-center w-full justify-center" v-html="fpsValues[fps]"></div></template>
            </toggle>
        </form-group>
        <form-group class="flex-col">
            <template v-slot:label>
                <div class="flex items-center" v-html="_i18n('locales')"></div>
            </template>
            <radio-group class="flex flex-col"
                         :options="localeOptions"
                         name="name" :with-default="false"
                         v-model:value="settings.locale"
                         :classes="{root: {'flex flex-row': true}}"
                         @selected="(v) => settings.locale = v">
                <template v-slot:label="item">
                    <span v-html="item.label"></span>
                </template>
                <template v-slot:center="item">
                    <div :class="bgImageClass(item.value)" :style="`background-image: url(${bgSrc(item.value)})`"></div>
                </template>

            </radio-group>
        </form-group>
    </panel>
</template>
<script>
    import Toggle from '$lib/game/core/components/common/controls/Toggle';
    import RadioGroup from '$lib/game/core/components/common/controls/RadioGroup';
    import Range from '$lib/game/core/components/common/controls/MinMaxRange';
    import SettingsMixin from '$lib/game/core/components/mixins/settings-mixin';
    import Panel from './Panel';
    import FormGroup from './FormGroup';
    import { deepMerge, deepGet, deepSet, raw } from '$lib/game/utils/object';
    import { watch, watchEffect,ref } from 'vue';
    export default {
            setup() {
                watch((a) => {
                });
            },
        data() {
            return {
                fps: false,
                locale: '',
                key: 0
            };
        },
        mixins: [SettingsMixin],
        methods: {
            _i18n(slug) {
                return this.i18n(`pages.settings.tabs.system.${slug}`);
            },
            countryFlag(code) {
                if ('en' === code) {
                    code = 'gb';
                }

                return code.toUpperCase();
            },
            bgImageClass(value) {
                return {
                    'bg-center bg-no-repeat bg-cover rounded-full w-full h-full': true,
                    'bg-center': ['bg', 'en'].indexOf(value) > -1,
                    'bg-left': ['gr'].indexOf(value) > -1,
                };
            },
            bgSrc(value) {
                return `${this.settings.assetsBaseUrl}flags/svg/${value}.svg`;
            }
        },
        watch: {
            'settings.locale': {
                deep: true,
                handler(n, o) {
                    this.key++;
                }
            },
            fps(checked) {
                this.settings.fps = this.fpsValues[checked];
            }
        },
        computed: {
            fpsValues() {
                return {
                    true: 60,
                    false: 32
                };
            },
            fpsChecked() {
                return this.fpsValues[true] === this.settings.fps;
            },
            wrapperClasses() {
                return {
                    wrapper: {
                        'bg-red-500': true
                    }
                };

            },
            localeOptions() {
                const list = [];
                for (let i in this.settings.locales) {
                    list.push({
                        label: this._i18n(`languages.${this.settings.locales[i]}`),
                        name: this.settings.locales[i]

                    });
                }

                return list;
            }
        },
        components: {Toggle, Panel, FormGroup, RadioGroup},
        mounted() {
            this.fps = this.fpsValues[true] === this.settings.fps;
        }
    }
</script>