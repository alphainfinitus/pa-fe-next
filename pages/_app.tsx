// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import '../styles/fonts.css';
import 'semantic-ui-css/semantic.min.css';
import '@polkadot/api-augment';

import { ThemeProvider } from '@xstyled/styled-components';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';

import Apollo from '../src/components/Apollo';
import AppLayout from '../src/components/AppLayout';
import Modal from '../src/components/Modal';
import Notifications from '../src/components/Notifications';
import { ApiContextProvider } from '../src/context/ApiContext';
import { ModalProvider } from '../src/context/ModalContext';
import { NotificationProvider } from '../src/context/NotificationContext';
import { UserDetailsProvider } from '../src/context/UserDetailsContext';
import { GlobalStyle, MediaContextProvider } from '../src/GlobalStyle';
import { theme } from '../src/themes/theme';
import getNetwork from '../src/util/getNetwork';

const network = getNetwork();

const App = ({ Component, pageProps }: AppProps) => {
	return (
		<React.StrictMode>
			<>
				<Head>
					<title>Polkassembly | {network}</title>
					<meta name="description" content={`Polkassembly, discussion platform for ${network} governance`} />
					<meta charSet="utf-8" />
					<link rel="icon" href="/favicon.ico" />
					<meta name="theme-color" content="#000000" />
					<meta property="og:title" content="Polkassembly" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<meta property="og:type" content="website" />
					<meta property="og:image" content="https://polkassembly.io/images/polkassembly.png" />
					<meta property="og:description" content="Democratizing governance for substrate blockchains" />
					<link rel="apple-touch-icon" href="/logo192.png" />
					<link rel="manifest" href="/manifest.json" />
				</Head>
				<ThemeProvider theme={theme}>
					<NotificationProvider>
						<ModalProvider>
							<UserDetailsProvider>
								<Apollo>
									<GlobalStyle />
									<Notifications/>
									<Modal/>
									<ApiContextProvider>
										<MediaContextProvider>
											<AppLayout Component={Component} pageProps={pageProps}  />
										</MediaContextProvider>
									</ApiContextProvider>
								</Apollo>
							</UserDetailsProvider>
						</ModalProvider>
					</NotificationProvider>
				</ThemeProvider>
			</>
		</React.StrictMode>
	);
};

export default App;
