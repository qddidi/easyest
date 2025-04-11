import { App } from "vue"
import * as components from "./src"
export * from "./src";
export default {
    install(app: App) {
        for (const key in components) {
            app.component((components as any)[key].name, (components as any)[key])
        }
    }
}
