<template>
    <div class="tab">
        <div
                class="item"
                v-for="(item, i) in currOptions"
                :class="item | tabItemClass"
                :key="i"
                @click="onTabSelect(item)">
            {{item.text}}
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            value: {
                type: String
                // type: Number
            },
            options: {
                type: Array,
                default: []
            }
        },
        data() {
            return {
                currValue: this.value,
                currOptions: []
            }
        },
        mounted() {
            this.initOptions();
        },
        methods: {
            initOptions() {
                this.currOptions = this.options.map(item => {
                    return {
                        ...item,
                        active: item.value === this.currValue,
                        disabled: !!item.disabled
                    }
                });
            },
            onTabSelect(item) {
                if (item.disabled) return;
                this.currOptions.forEach(obj => obj.active = false);
                item.active = true;
                this.currValue = item.value;
                this.$emit('input', this.currValue);
            }
        },
        filters: {
            tabItemClass(item) {
                let classList = [];
                if (item.active) classList.push('active');
                if (item.disabled) classList.push('disabled');
                return classList.join(' ');
            }
        },
        watch: {
            options:{
                handler(curVal,oldVal){
                    this.initOptions();
                },
                deep:true
            },
            value(value) {
                this.currValue = value;
            }
        }
    }
</script>

<style lang="less" scoped>
    .tab {
        @borderColor: #ddd;
        @radius: 1px;
        width: 100%;
        /*margin: 1%;*/
        overflow: hidden;
        position: relative;
        .item {
            /*width: 16.33%;  // 首页在tab时*/
            width:19.67%;
            padding: 10px 0;
            text-align: center;
            border-top: 1px solid @borderColor;
            border-left: 1px solid @borderColor;
            border-bottom: 1px solid @borderColor;
            font-size: 121.55%;
            background-color: #fff;
            float: left;
            user-select: none;
            cursor: pointer;
            transition: 300ms;
            &:first-child {
                border-top-left-radius: @radius;
                border-bottom-left-radius: @radius;
            }
            &:last-child {
                border-right: 1px solid @borderColor;
                border-top-right-radius: @radius;
                border-bottom-right-radius: @radius;
            }
            &.active {
                color: #fff;
                background-color: rgb(7, 193, 96);
            }
            &:hover {
                color: #fff;
                /*background-color: #f06;*/
                background-color: rgb(7, 193, 96);
            }
            &.disabled {
                color: #fff;
                background-color: #dddddd;
                cursor: no-drop;
            }
        }
    }
</style>
