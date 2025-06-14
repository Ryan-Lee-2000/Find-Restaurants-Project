// import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import Material from '@primeuix/themes/material'
import Button from "primevue/button"
import DataView from 'primevue/dataview';

import Rating from 'primevue/rating';

const app = createApp(App)
app.use(PrimeVue, {
    theme: {
        preset: Material
        
    }
});
app.component('Button', Button);
app.component('DataView', DataView);
app.component('Rating', Rating)
app.mount('#app')
