import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'
import JsonViewer from "vue3-json-viewer";
// if you used v1.0.5 or latster ,you should add import "vue3-json-viewer/dist/index.css"
import "vue3-json-viewer/dist/index.css";

const app = createApp(App);
app.use(JsonViewer);

app.use(router)


app.mount('#app')
