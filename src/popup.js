// init app
import { createApp } from 'vue';
import Popup from '@/Popup.vue';
const app = createApp(Popup);

// provide global properties
app.provide('version', APP_VERSION);

// internationalization
import { createI18n } from 'vue-i18n';
import { loadMessages, pluralRules } from "@/translations.js";
const i18n = createI18n({
	legacy: false,
	globalInjection: true,
	locale: messenger.i18n.getUILanguage(),
	fallbackLocale: "en",
	messages: await loadMessages(),
	pluralRules,
});
app.use(i18n);

// ready? let's go!
app.mount('#popup');
