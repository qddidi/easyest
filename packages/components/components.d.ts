import type { DefineComponent } from 'vue';
import * as components from './src/index';
declare module 'vue' {
    export interface GlobalComponents {
        Ebutton: typeof components.Button; // 添加组件类型声明
    }
}