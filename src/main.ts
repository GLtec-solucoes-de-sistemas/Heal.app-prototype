import './assets/main.css';
import { createApp } from 'vue';
import App from './App.vue';

import { Quasar } from 'quasar';
import quasarIconSet from 'quasar/icon-set/material-icons';
import quasarLang from 'quasar/lang/pt-BR';
import 'quasar/dist/quasar.sass';
import 'material-icons/iconfont/material-icons.css';

const app = createApp(App);

app.use(Quasar, {
  plugins: {},
  lang: quasarLang,
  iconSet: quasarIconSet,
});

app.mount('#app');
