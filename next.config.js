// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const nextConfig = {
	compiler: {
		styledComponents: true
	},
	env: {
		HASURA_GRAPHQL_ADMIN_SECRET: process.env.HASURA_GRAPHQL_ADMIN_SECRET,
		REACT_APP_APPNAME: process.env.REACT_APP_APPNAME,
		REACT_APP_DEMOCRACY_PRECOMPILE: process.env.REACT_APP_DEMOCRACY_PRECOMPILE,
		REACT_APP_ENV: process.env.REACT_APP_ENV,
		REACT_APP_EVENT_BOT_USER_ID: process.env.REACT_APP_EVENT_BOT_USER_ID,
		REACT_APP_HASURA_GRAPHQL_URL: process.env.REACT_APP_HASURA_GRAPHQL_URL,
		REACT_APP_JWT_PRIVATE_KEY: process.env.REACT_APP_JWT_PRIVATE_KEY,
		REACT_APP_JWT_PUBLIC_KEY: process.env.REACT_APP_JWT_PUBLIC_KEY,
		REACT_APP_NETWORK: process.env.REACT_APP_NETWORK,
		REACT_APP_WS_PROVIDER: process.env.REACT_APP_WS_PROVIDER,
		SKIP_PREFLIGHT_CHECK: process.env.SKIP_PREFLIGHT_CHECK
	},
	reactStrictMode: true,
	swcMinify: true
};

module.exports = nextConfig;
