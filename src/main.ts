import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'

import { runSingleInstance } from './utils/run-signle-instance';
import { worker } from './server/worker';


async function enableMocking() {
    return new Promise(async (resolve) => {
        const isGitHubPages = import.meta.env.VITE_GH_PAGES === '1';

        const startMockWorker = () => worker.start({
            onUnhandledRequest: 'bypass',
            quiet: false,
            serviceWorker: {
                url: `${isGitHubPages ? '/demo-dapp-with-vue-ui' : ''}/mockServiceWorker.js`
            }
        });

        if (isGitHubPages) {
            console.log('Deployed to GitHub Pages');
        } else {
            console.log('Deployed to other environment');
        }
        let serviceWorkerRegistration = await startMockWorker();
        resolve(serviceWorkerRegistration);

        const verifyAndRestartWorker = runSingleInstance(async () => {
            console.log("verifyAndRestartWorker");
            const serviceWorkerRegistrations = await navigator.serviceWorker.getRegistrations();

            if (serviceWorkerRegistrations.length === 0) {
                await serviceWorkerRegistration?.unregister();
                serviceWorkerRegistration = await startMockWorker();
            }
        });

        setInterval(verifyAndRestartWorker, 5000);
    });
}
const app = createApp(App);

app.use(router)

enableMocking().then(() => {
    app.mount('#app')
})
