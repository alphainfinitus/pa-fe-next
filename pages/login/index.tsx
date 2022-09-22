// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useContext, useEffect,useState } from 'react';
import { Grid } from 'semantic-ui-react';

import Web2Login from '../../src/components/Login/Web2Login';
import { UserDetailsContext } from '../../src/context/UserDetailsContext';
import { Wallet } from '../../src/types';

interface Props {
	className?: string
}

const Web3Login = dynamic(() => import('../../src/components/Login/Web3Login'), {
	ssr: false
});

const Login = ({ className }: Props) => {
	const currentUser = useContext(UserDetailsContext);
	const router = useRouter();
	const [displayWeb, setDisplayWeb] = useState(2);
	const [chosenWallet, setChosenWallet] = useState<Wallet>();
	const [walletError, setWalletError] =  useState<string | undefined>();

	const setDisplayWeb2 = () => setDisplayWeb(2);

	const onWalletSelect = (wallet: Wallet) => {
		setChosenWallet(wallet);
		setDisplayWeb(3);
	};

	useEffect(() => {
		if (currentUser?.id) {
			router.push('/');
		}
	}, [router, currentUser, currentUser?.id]);

	return (
		<>
			<Head>
				<title>Polkassembly | Login</title>
			</Head>

			<Grid centered className={className}>
				<Grid.Column mobile={16} tablet={14} computer={8} style={ { minWidth: 'min-content' } }>
					{ displayWeb === 2 ? <Web2Login onWalletSelect={onWalletSelect} walletError={walletError} /> : null}

					{displayWeb === 3 && chosenWallet ? <Web3Login chosenWallet={chosenWallet} setDisplayWeb2={setDisplayWeb2} setWalletError={setWalletError} /> : null}
				</Grid.Column>
			</Grid>
		</>
	);
};

export default Login;
