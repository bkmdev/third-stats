import { pluralPolish, pluralUkrainian } from "@/utils.js";

const localePaths = {
	ca:   'ca',          // Catalan
	cs:   'cs',          // Czech
	de:   'de',          // German
	en:   'en',          // English
	es:   'es',          // Spanish
	fi:   'fi',          // Finnish
	fr:   'fr',          // French
	gl:   'gl',          // Galician
	hi:   'hi',          // Hindi
	hu:   'hu',          // Hungarian
	id:   'id',          // Indonesian
	it:   'it',          // Italian
	nl:   'nl',          // Dutch
	ja:   'ja',          // Japanese
	pl:   'pl',          // Polish
	pt:   'pt',          // Portuguese
	ptbr: 'pt-BR',       // Brazilian Portuguese
	ru:   'ru',          // Russian
	sk:   'sk',          // Slovak
	sv:   'sv',          // Swedish
	th:   'th',          // Thai
	tr:   'tr',          // Turkish
	uk:   'uk',          // Ukrainian
	uz:   'uz',          // Uzbek
	zhcn: 'zh-Hans-CN',  // Chinese (China, Simplified)
	zhtw: 'zh-Hant-TW',  // Chinese (Taiwan, Traditional)
};

export const loadMessages = async () => Object.fromEntries(
	await Promise.all(
		Object.entries(localePaths).map(async ([locale, path]) => {
			const response = await fetch(`/_locales/${path}/messages.json`);
			return [locale, await response.json()];
		})
	)
);

export const pluralRules = {
	"pl": pluralPolish,
	"uk": pluralUkrainian,
}
