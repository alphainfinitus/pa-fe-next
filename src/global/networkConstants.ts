// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable sort-keys */
import { ChainLinksType, ChainPropType } from '../types';

export const network = {
	POLKADOT: 'polkadot',
	KUSAMA: 'kusama',
	ACUITY: 'acuity',
	ALTAIR: 'altair',
	AMPLITUDE: 'amplitude',
	ASTAR: 'astar',
	AUTOMATA: 'automata',
	BASILISK: 'basilisk',
	BIFROST: 'bifrost',
	CALAMARI: 'calamari',
	CENTRIFUGE: 'centrifuge',
	GEAR: 'gear',
	HEIKO: 'heiko',
	HYDRADX: 'hydradx',
	KARURA: 'karura',
	KHALA: 'khala',
	KILT: 'kilt',
	KYLIN: 'kylin',
	MANTA: 'manta',
	MOONBASE: 'moonbase',
	MOONBEAM: 'moonbeam',
	MOONRIVER: 'moonriver',
	PARALLEL: 'parallel',
	PENDULUM: 'pendulum',
	PIONEER: 'pioneer',
	POLKADEX: 'polkadex',
	ROBONOMICS: 'robonomics',
	SHIBUYA: 'shibuya',
	SHIDEN: 'shiden',
	TANGANIKA: 'tanganika',
	TINKER: 'tinker',
	TURING: 'turing',
	WESTEND: 'westend'
};

export const tokenSymbol = {
	ACU: 'ACU',
	ASTR: 'ASTR',
	ATA: 'ATA',
	BNC: 'BNC',
	BSX: 'BSX',
	CFG: 'CFG',
	DOL: 'DOL',
	DEV: 'DEV',
	DHX: 'DHX',
	DOT: 'DOT',
	GLMR: 'GLMR',
	HDX: 'HDX',
	HKO: 'HKO',
	KAR: 'KAR',
	KHA: 'KHA',
	KILT: 'KILT',
	KMA: 'KMA',
	KSM: 'KSM',
	KYL: 'KYL',
	MOVR: 'MOVR',
	PARA: 'PARA',
	PDEX: 'PDEX',
	PEND: 'PEND',
	SBY: 'SBY',
	SDN: 'SDN',
	TUR: 'TUR',
	WND: 'WND',
	XRT: 'XRT',
	UNIT: 'UNIT'
};

export const chainProperties: ChainPropType = {
	[network.POLKADOT]: {
		blockTime: 6000,
		chainId: 0,
		logo: '/static/parachain-logos/polkadot-logo.jpg',
		rpcEndpoint: 'wss://rpc.polkadot.io',
		ss58Format: 0,
		tokenDecimals: 10,
		tokenSymbol: tokenSymbol.DOT
	},
	[network.KUSAMA]: {
		blockTime: 6000,
		chainId: 0,
		logo: '/static/parachain-logos/kusama-logo.gif',
		rpcEndpoint: 'wss://kusama-rpc.polkadot.io',
		ss58Format: 2,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.KSM
	},
	[network.ACUITY]: {
		blockTime: 6000,
		chainId: 0,
		logo: '/static/parachain-logos/acuity-logo.jpg',
		rpcEndpoint: 'wss://freemont.acuity.social',
		ss58Format: 42,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.ACU
	},
	[network.ALTAIR]: {
		blockTime: 12000,
		chainId: 0,
		logo: '/static/parachain-logos/altair-logo.jpeg',
		rpcEndpoint: 'wss://altair.api.onfinality.io/public-ws',
		ss58Format: 136,
		tokenDecimals: 18,
		tokenSymbol: tokenSymbol.BNC
	},
	[network.AMPLITUDE]: {
		blockTime: 12000,
		chainId: 0,
		logo: '/static/parachain-logos/amplitude-logo.png',
		rpcEndpoint: 'wss://altair.api.onfinality.io/public-ws',
		ss58Format: 8,
		tokenDecimals: 18,
		tokenSymbol: tokenSymbol.BNC
	},
	[network.ASTAR]: {
		blockTime: 12000,
		chainId: 592,
		logo: '/static/parachain-logos/astar-logo.png',
		rpcEndpoint: 'wss://astar.api.onfinality.io/public-ws',
		ss58Format: 5,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.ASTR
	},
	[network.AUTOMATA]: {
		blockTime: 6000,
		chainId: 0,
		logo: '/static/parachain-logos/automata-logo.jpg',
		rpcEndpoint: 'wss://automata.api.onfinality.io/public-ws',
		ss58Format: 88,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.ATA
	},
	[network.BASILISK]: {
		blockTime: 12000,
		chainId: 2090,
		logo: '/static/parachain-logos/basilisk-logo.jpg',
		rpcEndpoint: 'wss://basilisk.api.onfinality.io/public-ws',
		ss58Format: 10041,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.BSX
	},
	[network.BIFROST]: {
		blockTime: 12000,
		chainId: 0,
		logo: '/static/parachain-logos/bifrost-logo.png',
		rpcEndpoint: 'wss://hk.p.bifrost-rpc.liebi.com/ws',
		ss58Format: 6,
		tokenDecimals: 18,
		tokenSymbol: tokenSymbol.BNC
	},
	[network.PIONEER]: {
		blockTime: 12000,
		chainId: 0,
		logo: '/static/parachain-logos/bitcountrypioneer-logo.jpg',
		rpcEndpoint: 'wss://pioneer.api.onfinality.io/public-ws',
		ss58Format: 6,
		tokenDecimals: 18,
		tokenSymbol: tokenSymbol.BNC
	},
	[network.CALAMARI]: {
		blockTime: 12000,
		chainId: 2084,
		logo: '/static/parachain-logos/calamari-logo.png',
		rpcEndpoint: 'wss://calamari.api.onfinality.io/public-ws',
		ss58Format: 78,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.KMA
	},
	[network.CENTRIFUGE]: {
		blockTime: 12000,
		chainId: 0,
		logo: '/static/parachain-logos/centrifuge-logo.png',
		rpcEndpoint: 'wss://centrifuge-parachain.api.onfinality.io/public-ws',
		ss58Format: 36,
		tokenDecimals: 18,
		tokenSymbol: tokenSymbol.CFG
	},
	[network.GEAR]: {
		blockTime: 1000,
		chainId: 0,
		logo: '/static/parachain-logos/gear-logo.jpg',
		rpcEndpoint: 'wss://rpc-node.gear-tech.io:443',
		ss58Format: 42,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.UNIT
	},
	[network.HEIKO]: {
		blockTime: 13000,
		chainId: 0,
		logo: '/static/parachain-logos/hydradx-logo.jpg',
		rpcEndpoint: 'wss://heiko-rpc.parallel.fi',
		ss58Format: 63,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.HKO
	},
	[network.HYDRADX]: {
		blockTime: 12000,
		chainId: 0,
		logo: '/static/parachain-logos/hydradx-logo.jpg',
		rpcEndpoint: 'wss://hydradx-rpc.dwellir.com',
		ss58Format: 63,
		tokenDecimals: 18,
		tokenSymbol: tokenSymbol.HDX
	},
	[network.KARURA]: {
		blockTime: 12000,
		chainId: 0,
		logo: '/static/parachain-logos/karura-logo.jpg',
		rpcEndpoint: 'wss://karura.api.onfinality.io/public-ws',
		ss58Format: 8,
		tokenDecimals: 18,
		tokenSymbol: tokenSymbol.KAR
	},
	[network.KYLIN]: {
		blockTime: 12000,
		chainId: 0,
		logo: '/static/parachain-logos/kylin-logo.png',
		rpcEndpoint: 'wss://polkadot.kylin-node.co.uk',
		ss58Format: 42,
		tokenDecimals: 18,
		tokenSymbol: tokenSymbol.KYL
	},
	[network.KHALA]: {
		blockTime: 12000,
		chainId: 0,
		logo: '/static/parachain-logos/khala-logo.png',
		rpcEndpoint: 'wss://khala.api.onfinality.io/public-ws',
		ss58Format: 30,
		tokenDecimals: 18,
		tokenSymbol: tokenSymbol.KHA
	},
	[network.KILT]: {
		blockTime: 12000,
		chainId: 0,
		logo: '/static/parachain-logos/kilt-logo.png',
		rpcEndpoint: 'wss://kusama-rpc.polkadot.io',
		ss58Format: 38,
		tokenDecimals: 15,
		tokenSymbol: tokenSymbol.KILT
	},
	[network.MANTA]: {
		blockTime: 12000,
		chainId: 1287,
		logo: '/static/parachain-logos/manta-logo.jpg',
		rpcEndpoint: 'wss://ws.rococo.dolphin.engineering',
		ss58Format: 78,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.DOL
	},
	[network.MOONBASE]: {
		blockTime: 12000,
		chainId: 1287,
		logo: '/static/parachain-logos/moonbase-logo.png',
		rpcEndpoint: 'wss://moonbeam-alpha.api.onfinality.io/public-ws',
		ss58Format: 0,
		tokenDecimals: 18,
		tokenSymbol: tokenSymbol.DEV
	},
	[network.MOONBEAM]: {
		blockTime: 12000,
		chainId: 1284,
		logo: '/static/parachain-logos/moonbeam-logo.png',
		rpcEndpoint: 'wss://moonbeam.api.onfinality.io/public-ws',
		ss58Format: 1284,
		tokenDecimals: 18,
		tokenSymbol: tokenSymbol.GLMR
	},
	[network.MOONRIVER]: {
		blockTime: 12000,
		chainId: 1285,
		logo: '/static/parachain-logos/moonriver-logo.png',
		rpcEndpoint: 'wss://moonriver.api.onfinality.io/public-ws',
		ss58Format: 1285,
		tokenDecimals: 18,
		tokenSymbol: tokenSymbol.MOVR
	},
	[network.PARALLEL]: {
		blockTime: 12000,
		chainId: 172,
		logo: '/static/parachain-logos/parallel-logo.jpg',
		rpcEndpoint: 'wss://rpc.parallel.fi',
		ss58Format: 172,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.PARA
	},
	[network.PENDULUM]: {
		blockTime: 6000,
		chainId: 0,
		logo: '/static/parachain-logos/pendulum-logo.jpg',
		rpcEndpoint: 'wss://kusama-rpc.polkadot.io',
		ss58Format: 88,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.PEND
	},
	[network.POLKADEX]: {
		blockTime: 12000,
		chainId: 0,
		logo: '/static/parachain-logos/polkadex-logo.jpg',
		rpcEndpoint: 'wss://polkadex.api.onfinality.io/public-ws',
		ss58Format: 88,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.PDEX
	},
	[network.ROBONOMICS]: {
		blockTime: 12000,
		chainId: 2048,
		logo: '/static/parachain-logos/robonomics-logo.jpg',
		rpcEndpoint: 'wss://robonomics.api.onfinality.io/public-ws',
		ss58Format: 32,
		tokenDecimals: 9,
		tokenSymbol: tokenSymbol.XRT
	},
	[network.SHIBUYA]: {
		blockTime: 12000,
		chainId: 81,
		logo: '/static/parachain-logos/shiden-logo.jpg',
		rpcEndpoint: 'wss://shibuya-rpc.dwellir.com',
		ss58Format: 5,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.SBY
	},
	[network.SHIDEN]: {
		blockTime: 12000,
		chainId: 336,
		logo: '/static/parachain-logos/shiden-logo.jpg',
		rpcEndpoint: 'wss://shiden.api.onfinality.io/public-ws',
		ss58Format: 5,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.SDN
	},
	[network.TANGANIKA]: {
		blockTime: 12000,
		chainId: 336,
		logo: '/static/parachain-logos/tanganika-logo.png',
		rpcEndpoint: 'wss://tanganika.datahighway.com',
		ss58Format: 42,
		tokenDecimals: 12,
		tokenSymbol: tokenSymbol.DHX
	},
	[network.TURING]: {
		blockTime: 12000,
		chainId: 2114,
		logo: '/static/parachain-logos/turing-logo.png',
		rpcEndpoint: 'wss://turing-rpc.dwellir.com',
		ss58Format: 51,
		tokenDecimals: 10,
		tokenSymbol: tokenSymbol.TUR
	},
	[network.WESTEND]: {
		blockTime: 6000,
		chainId: 0,
		logo: '/static/parachain-logos/westend-logo.jpg',
		rpcEndpoint: 'wss://kusama-rpc.polkadot.io',
		ss58Format: 0,
		tokenDecimals: 10,
		tokenSymbol: tokenSymbol.WND
	}
};

export const chainLinks: ChainLinksType = {
	[network.POLKADOT]: {
		blockExplorer: 'https://polkadot.subscan.io/',
		discord: 'https://discord.gg/wGUDt2p',
		github: 'https://github.com/paritytech/polkadot',
		homepage: 'https://polkadot.network/',
		reddit: 'https://www.reddit.com/r/polkadot',
		telegram: 'https://t.me/PolkadotOfficial',
		twitter: 'https://twitter.com/Polkadot',
		youtube: 'https://www.youtube.com/channel/UCB7PbjuZLEba_znc7mEGNgw'
	},
	[network.KUSAMA]: {
		blockExplorer: 'https://kusama.subscan.io/',
		discord: 'https://discord.gg/9AWjTf8wSk',
		github: 'https://github.com/paritytech/polkadot',
		homepage: 'https://kusama.network/',
		reddit: 'https://www.reddit.com/r/Kusama/',
		telegram: 'https://t.me/kusamanetworkofficial',
		twitter: 'https://twitter.com/kusamanetwork',
		youtube: 'https://www.youtube.com/channel/UCq4MRrQhdoIR0b44GxcCPxw'
	}
};

export const chainDetails: { [index: string]: string} = {
	[network.POLKADOT]: 'Polkadot enables scalability by allowing specialized blockchains to communicate with each other in a secure, trust-free environment. Polkadot is built to connect and secure unique blockchains, whether they be public, permission-less networks, private consortium chains, or oracles and other Web3 technologies. It enables an internet where independent blockchains can exchange information under common security guarantees. Polkadot uses a sophisticated governance mechanism that allows it to evolve gracefully overtime at the ultimate behest of its assembled stakeholders. The stated goal is to ensure that the majority of the stake can always command the network.',
	[network.KUSAMA]: 'Kusama is an early release of Polkadot: a scalable, multichain network for radical innovation. Kusama serves as a proving ground that allows teams and developers to build and deploy a parachain, and experiment with Polkadot’s governance and NPoS functionality in a real environment.'
};

export const addressPrefix: Record<string, number> = {
	'kusama': 2,
	'moonbeam': 1284,
	'moonriver': 1285,
	'polkadot': 0
};