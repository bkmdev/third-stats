const folders = {
	inbox: { id: 'folder-inbox', name: 'Inbox', path: '/Inbox', subFolders: [] },
	promotions: { id: 'folder-promotions', name: 'Promotions', path: '/Promotions', subFolders: [] },
	newsletters: { id: 'folder-newsletters', name: 'Newsletters', path: '/Newsletters', subFolders: [] },
	attachments: { id: 'folder-attachments', name: 'Large Attachments', path: '/Large Attachments', subFolders: [] },
	receipts: { id: 'folder-receipts', name: 'Receipts', path: '/Receipts', subFolders: [] },
};

const rootFolder = {
	id: 'root-account1',
	name: 'Mock Gmail',
	path: '/',
	isRoot: true,
	subFolders: Object.values(folders),
};

const account = {
	id: 'account1',
	name: 'Mock Gmail',
	type: 'imap',
	rootFolder,
	identities: [{ email: 'me@example.com' }],
};

const makeMessage = (id, folder, overrides = {}) => ({
	id,
	author: overrides.author ?? 'Newsletter <news@example.com>',
	recipients: overrides.recipients ?? ['Me <me@example.com>'],
	ccList: [],
	bccList: [],
	date: overrides.date ?? new Date(),
	flagged: overrides.flagged ?? false,
	hasAttachments: overrides.hasAttachments ?? false,
	junk: overrides.junk ?? false,
	junkScore: overrides.junkScore ?? 0,
	read: overrides.read ?? true,
	size: overrides.size ?? 125000,
	subject: overrides.subject ?? `Sample message ${id}`,
	tags: overrides.tags ?? [],
	folder,
});

const sampleMessages = {
	[folders.inbox.id]: [
		makeMessage(1, folders.inbox, {
			author: 'Client Files <client@example.com>',
			date: new Date('2025-05-12T10:15:00'),
			size: 18500000,
			subject: 'Final presentation files',
			hasAttachments: true,
			tags: ['work'],
		}),
		makeMessage(2, folders.inbox, {
			author: 'Design Store <deals@design.example>',
			date: new Date('2025-04-20T09:10:00'),
			size: 2200000,
			subject: 'Spring design asset bundle',
			tags: ['promo'],
		}),
		makeMessage(10, folders.inbox, {
			author: 'Me <me@example.com>',
			recipients: ['Client Files <client@example.com>'],
			date: new Date('2025-05-13T14:30:00'),
			size: 4200000,
			subject: 'Re: Final presentation files',
			hasAttachments: true,
			tags: ['work'],
		}),
	],
	[folders.promotions.id]: [
		makeMessage(14, folders.promotions, {
			author: 'Suspicious Sender <spam@unknown.example>',
			date: new Date('2025-08-22T06:20:00'),
			size: 910000,
			subject: 'You won a prize',
			junk: true,
			junkScore: 95,
			tags: ['promo'],
		}),
		makeMessage(3, folders.promotions, {
			author: 'Shop Daily <sales@shop.example>',
			date: new Date('2024-12-01T08:30:00'),
			size: 5400000,
			subject: 'Last chance sale',
			tags: ['promo'],
		}),
		makeMessage(4, folders.promotions, {
			author: 'Travel Deals <offers@travel.example>',
			date: new Date('2024-10-15T12:00:00'),
			size: 3600000,
			subject: 'Weekend fare alerts',
			tags: ['promo'],
		}),
	],
	[folders.newsletters.id]: [
		makeMessage(12, folders.newsletters, {
			author: 'Weekly Product News <digest@product.example>',
			date: new Date('2026-01-14T07:45:00'),
			size: 1450000,
			subject: 'January product digest',
			tags: ['newsletter'],
		}),
		makeMessage(5, folders.newsletters, {
			author: 'Weekly Product News <digest@product.example>',
			date: new Date('2024-07-11T07:45:00'),
			size: 1200000,
			subject: 'Your weekly product digest',
			tags: ['newsletter'],
		}),
		makeMessage(6, folders.newsletters, {
			author: 'Weekly Product News <digest@product.example>',
			date: new Date('2024-06-18T07:45:00'),
			size: 1350000,
			subject: 'Summer launch recap',
			tags: ['newsletter'],
		}),
	],
	[folders.attachments.id]: [
		makeMessage(13, folders.attachments, {
			author: 'Me <me@example.com>',
			recipients: ['Video Export <video@example.com>'],
			date: new Date('2026-02-03T15:10:00'),
			size: 33000000,
			subject: 'Updated video export',
			hasAttachments: true,
			tags: ['work'],
		}),
		makeMessage(7, folders.attachments, {
			author: 'Photos <photos@example.com>',
			date: new Date('2023-11-05T18:20:00'),
			size: 74000000,
			subject: 'Shared photo archive',
			hasAttachments: true,
			tags: ['personal'],
		}),
		makeMessage(8, folders.attachments, {
			author: 'Video Export <video@example.com>',
			date: new Date('2023-03-15T13:00:00'),
			size: 126000000,
			subject: 'Video export files',
			hasAttachments: true,
			tags: ['work'],
		}),
	],
	[folders.receipts.id]: [
		makeMessage(9, folders.receipts, {
			author: 'Store Receipt <receipts@store.example>',
			date: new Date('2022-06-20T09:00:00'),
			size: 840000,
			subject: 'Your receipt',
			tags: ['receipt'],
		}),
		makeMessage(11, folders.receipts, {
			author: 'Me <me@example.com>',
			recipients: ['Store Receipt <receipts@store.example>'],
			date: new Date('2022-07-02T11:25:00'),
			size: 260000,
			subject: 'Receipt follow-up',
			tags: ['receipt'],
		}),
	],
};

const localStore = new Map([
	['options', {
		theme: 'system',
		cache: false,
		debug: true,
		accounts: ['account1'],
		accountColors: { account1: '#0a84ff' },
		maxListCount: 20,
		liveCountUp: true,
		autoRefresh: false,
	}],
	['error', false],
]);

const getStorageValue = key => {
	if (typeof key === 'string') return { [key]: localStore.get(key) };
	if (Array.isArray(key)) return Object.fromEntries(key.map(k => [k, localStore.get(k)]));
	if (key && typeof key === 'object') {
		return Object.fromEntries(Object.keys(key).map(k => [k, localStore.get(k) ?? key[k]]));
	}
	return Object.fromEntries(localStore.entries());
};

export const installMessengerMock = () => {
	if (globalThis.messenger) return;

	globalThis.__THIRD_STATS_MOCK__ = true;
	globalThis.messenger = {
		i18n: {
			getUILanguage: () => 'en',
		},
		accounts: {
			list: async () => [account],
			get: async () => account,
		},
		folders: {
			get: async () => rootFolder,
		},
		messages: {
			list: async folderId => ({ messages: sampleMessages[folderId] ?? [] }),
			continueList: async () => ({ messages: [] }),
			tags: {
				list: async () => [
					{ key: 'promo', tag: 'Promotions', color: '#f9844a' },
					{ key: 'work', tag: 'Work', color: '#43aa8b' },
					{ key: 'newsletter', tag: 'Newsletter', color: '#f9c74f' },
					{ key: 'receipt', tag: 'Receipts', color: '#577590' },
					{ key: 'personal', tag: 'Personal', color: '#9c89b8' },
				],
			},
		},
		storage: {
			local: {
				get: async key => getStorageValue(key),
				set: async values => Object.entries(values).forEach(([key, value]) => localStore.set(key, value)),
			},
			onChanged: {
				addListener: () => {},
			},
		},
		downloads: {
			download: async () => {},
		},
	};
};
