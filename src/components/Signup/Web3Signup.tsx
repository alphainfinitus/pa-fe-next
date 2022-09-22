// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { isWeb3Injected } from '@polkadot/extension-dapp';
import { Injected, InjectedAccount, InjectedWindow } from '@polkadot/extension-inject/types';
import { stringToHex } from '@polkadot/util';
import styled from '@xstyled/styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Divider, DropdownProps } from 'semantic-ui-react';

import ExtensionNotDetected from '../../components/ExtensionNotDetected';
import { ModalContext } from '../../context/ModalContext';
import { UserDetailsContext } from '../../context/UserDetailsContext';
import { useAddressSignupConfirmMutation, useAddressSignupStartMutation } from '../../generated/graphql';
import { APPNAME } from '../../global/appName';
import { handleTokenChange } from '../../services/auth.service';
import { Wallet } from '../../types';
import AccountSelectionForm from '../../ui-components/AccountSelectionForm';
import Button from '../../ui-components/Button';
import FilteredError from '../../ui-components/FilteredError';
import { Form } from '../../ui-components/Form';
import Loader from '../../ui-components/Loader';
import getEncodedAddress from '../../util/getEncodedAddress';
import getNetwork from '../../util/getNetwork';

interface Props {
	className?: string
	chosenWallet: Wallet
	setDisplayWeb2: () => void
	setWalletError: React.Dispatch<React.SetStateAction<string | undefined>>
}

const NETWORK = getNetwork();

const SignupForm = ({ className, setDisplayWeb2, chosenWallet, setWalletError }:Props): JSX.Element => {
	const [error, setErr] = useState<Error | null>(null);
	const [address, setAddress] = useState<string>('');
	const [accounts, setAccounts] = useState<InjectedAccount[]>([]);
	const [isAccountLoading, setIsAccountLoading] = useState(true);
	const [extensionNotFound, setExtensionNotFound] = useState(false);
	const [accountsNotFound, setAccountsNotFound] = useState(false);
	const router = useRouter();
	const [addressSignupStartMutation] = useAddressSignupStartMutation();
	const [addressSignupConfirmMutation, { loading }] = useAddressSignupConfirmMutation();
	const currentUser = useContext(UserDetailsContext);
	const { errors, handleSubmit, register } = useForm();
	const { setModal } = useContext(ModalContext);

	useEffect(() => {
		if (!accounts.length) {
			getAccounts(chosenWallet);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [accounts.length, chosenWallet]);

	const getAccounts = async (chosenWallet: Wallet): Promise<undefined> => {
		const injectedWindow = window as Window & InjectedWindow;

		let wallet = isWeb3Injected
			? injectedWindow.injectedWeb3[chosenWallet]
			: null;

		if (!wallet) {
			wallet = Object.values(injectedWindow.injectedWeb3)[0];
		}

		if (!wallet) {
			setExtensionNotFound(true);
			setIsAccountLoading(false);
			return;
		} else {
			setExtensionNotFound(false);
		}

		let injected: Injected | undefined;

		try {
			injected = await new Promise((resolve, reject) => {
				const timeoutId = setTimeout(() => {
					reject(new Error('Wallet Timeout'));
				}, 60000); // wait 60 sec

				wallet!.enable(APPNAME).then(value => {
					clearTimeout(timeoutId);
					resolve(value);
				}).catch(error => {
					reject(error);
				});
			});
		} catch (err) {
			setIsAccountLoading(false);

			if(err?.message == 'Rejected') {
				setWalletError('');
				handleToggle();
			} else if(err?.message == 'Pending authorisation request already exists for this site. Please accept or reject the request.') {
				setWalletError('Pending authorisation request already exists. Please accept or reject the request on the wallet extension and try again.');
				handleToggle();
			} else if(err?.message == 'Wallet Timeout'){
				setWalletError('Wallet authorisation timed out. Please accept or reject the request on the wallet extension and try again.');
				handleToggle();
			}
		}

		if(!injected) {
			return;
		}

		const accounts = await injected.accounts.get();

		if (accounts.length === 0) {
			setAccountsNotFound(true);
			setIsAccountLoading(false);
			return;
		} else {
			setAccountsNotFound(false);
		}

		accounts.forEach((account) => {
			account.address = getEncodedAddress(account.address) || account.address;
		});

		setAccounts(accounts);
		if (accounts.length > 0) {
			setAddress(accounts[0].address);
		}

		setIsAccountLoading(false);
		return;
	};

	const onAccountChange = (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
		const addressValue = data.value as string;
		setAddress(addressValue);
	};

	const handleSignup = async () => {
		if (!accounts.length) {
			return getAccounts(chosenWallet);
		}

		try {
			const injectedWindow = window as Window & InjectedWindow;

			let wallet = isWeb3Injected
				? injectedWindow.injectedWeb3[chosenWallet]
				: null;

			if (!wallet) {
				wallet = Object.values(injectedWindow.injectedWeb3)[0];
			}

			if (!wallet) {
				setExtensionNotFound(true);
				setIsAccountLoading(false);
				return;
			} else {
				setExtensionNotFound(false);
			}

			const injected = await wallet.enable(APPNAME);

			const signRaw = injected && injected.signer && injected.signer.signRaw;

			if (!signRaw) {
				return console.error('Signer not available');
			}

			const { data: startResult } = await addressSignupStartMutation({
				variables: {
					address
				}
			});

			const signMessage = startResult?.addressSignupStart?.signMessage;

			if (!signMessage) {
				throw new Error('Challenge message not found');
			}

			const { signature } = await signRaw({
				address,
				data: stringToHex(signMessage),
				type: 'bytes'
			});

			const { data: signupResult } = await addressSignupConfirmMutation({
				variables: {
					address,
					network: NETWORK,
					signature
				}
			});

			if (signupResult?.addressSignupConfirm?.token) {
				handleTokenChange(signupResult.addressSignupConfirm.token, currentUser);
				setModal({
					content: 'Add an email in settings if you want to be able to recover your account!',
					title: 'Add optional email'
				});
				router.back();
			} else {
				throw new Error('Web3 Login failed');
			}
		} catch (error) {
			setErr(error);
		}
	};

	const handleToggle = () => setDisplayWeb2();

	return (
		<Form className={className} onSubmit={handleSubmit(handleSignup)}>
			<h3>Sign-up</h3>
			{extensionNotFound?
				<div className='card'>
					<ExtensionNotDetected walletName={chosenWallet} />
				</div>
				: null
			}
			{accountsNotFound?
				<div className='card'>
					<div className='text-muted'>You need at least one account in Polkadot-js extenstion to login.</div>
					<div className='text-muted'>Please reload this page after adding accounts.</div>
				</div>
				: null
			}
			{isAccountLoading
				?
				<Loader text={'Requesting Web3 accounts'}/>
				:
				accounts.length > 0 &&
				<>
					<Form.Group>
						<AccountSelectionForm
							title='Choose linked account'
							accounts={accounts}
							address={address}
							onAccountChange={onAccountChange}
						/>
					</Form.Group>
					<Form.Field>
						<label className='checkbox-label'>
							<input
								className={errors.termsandconditions ? 'error' : ''}
								name='termsandconditions'
								value='yes'
								ref={register({ required: true })}
								type='checkbox'
							/>
							I have read and agree to the terms of the <Link href='/terms-and-conditions' passHref><a>Polkassembly end user agreement</a></Link>.
						</label>
						{errors.termsandconditions && <div className={'errorText'}>Please agree to the terms of the Polkassembly end user agreement.</div>}
					</Form.Field>
					<div className='text-muted'>To see how we use your personal data please see our <Link href='/privacy' passHref><a>privacy notice</a></Link>.</div>
					<div className={'mainButtonContainer'}>
						<Button
							primary
							disabled={loading}
							type='submit'
						>
							Sign-up
						</Button>

						<Button
							secondary
							disabled={loading}
							onClick={handleToggle}
						>
							Sign-up with username
						</Button>
					</div>
				</>
			}
			<div>
				{error?.message && <FilteredError className='info' text={error.message}/>}
			</div>
			<Divider horizontal>Or</Divider>
			<div className={'mainButtonContainer'}>
				<div className='text-center'> Already have an account ? Log In! </div>
				<Button secondary onClick={() => router.push('/login')} type='button' className='button pink_primary-text'>
					Login
				</Button>
			</div>
		</Form>
	);
};

export default styled(SignupForm)`
	.mainButtonContainer {
		align-items: center;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-top: 3rem;
	}

	input.error {
		border-style: solid;
		border-width: 1px;
		border-color: red_secondary;
	}

	.info {
		margin: 10px 0;
	}

	.errorText {
		color: red_secondary;
	}

	.checkbox-label {
		position: relative;
		bottom: 0.1rem;
		display: inline-block !important;
		font-size: sm !important;
		font-weight: 400 !important;
		color: grey_primary !important;
		a {
			color: grey_primary;
			border-bottom-style: solid;
			border-bottom-width: 1px;
			border-bottom-color: grey_primary;
		}
	}

	.ui.dimmer {
		height: calc(100% - 6.5rem);
	}

	.text-center{
		text-align: center;
		margin-bottom: 0.3em;
	}

	.button {
		width: 80%;
		margin: 4px 0;
		height: 40px;
	}

	.pink_primary-text{
		color: pink_primary !important;
	}
`;
