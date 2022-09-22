// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { ReactNode, useContext } from 'react';
import { Dropdown, Icon, Menu, Segment } from 'semantic-ui-react';

import { UserDetailsContext } from '../../context/UserDetailsContext';
import { useLogoutMutation } from '../../generated/graphql';
import { Media } from '../../GlobalStyle';
import { logout } from '../../services/auth.service';
import AddressComponent from '../../ui-components/Address';
import NetworkDropdown from '../../ui-components/NetworkDropdown';
import SearchBar from '../../ui-components/SearchBar';

interface Props {
	children?: ReactNode
	className?: string
	toggleSidebarHidden: () => void
	setSidebarHidden: React.Dispatch<React.SetStateAction<boolean>>
}

const MenuBar = ({ className, toggleSidebarHidden, setSidebarHidden } : Props): JSX.Element => {
	const currentUser = useContext(UserDetailsContext);
	const [logoutMutation] = useLogoutMutation();
	const router = useRouter();
	const { setUserDetailsContextState, username } = currentUser;

	const handleLogout = async () => {
		try {
			await logoutMutation();
		} catch (error) {
			console.error(error);
		}
		logout(setUserDetailsContextState);
		router.push('/');
	};

	const loggedOutItems = [
		{ content:'Login', href:'/login', icon:'sign in' },
		{ content: 'Sign-up', href:'/signup', icon:'plus circle' }
	];

	const loggedInItems = [
		{ content:'Notifications', href:'/notification-settings', icon:'bell' },
		{ content:'Settings',  href:'/settings', icon:'cog' },
		{ content:'View Profile', href:'/profile', icon:'user circle' },
		{ content:'Tracker', href:'/tracker', icon:'bookmark' },
		{ content:'Logout', href:'/', icon:'sign-out', onClick: handleLogout }
	];

	const toggleSidebar = () => {
		toggleSidebarHidden();
	};

	const userMenu = currentUser.web3signup && currentUser.defaultAddress
		? <><AddressComponent address={currentUser.defaultAddress} /></>
		: <><Icon size='big' name='user circle' inverted /> {username} </>;

	const userMenuMobile = currentUser.web3signup && currentUser.defaultAddress
		? <><AddressComponent className='mobile-address-component' address={currentUser.defaultAddress} disableAddress={true} /></>
		: <><Icon size='large' name='user circle' inverted /></>;

	const caretIcon = <Icon name='caret down' inverted />;

	return (
		<>
			<Segment.Group>
				<Segment as={Media} lessThan="computer">
					<Menu className={className} inverted widths={3} id='menubar'>
						<Menu.Menu position="left" className='sidebar-btn'>
							<Icon onClick={toggleSidebar} name="sidebar" size='large' />
						</Menu.Menu>
						<Link href='/' passHref>
							<Menu.Item as='a' className='logo' id='title'>
								<Image alt='Polkassembly Logo' src='/static/polkassembly-logo.png' width={130} height={40} />
							</Menu.Item>
						</Link>
						<Menu.Menu position="right">
							{username
								? <>
									<Dropdown onClick={() => (setSidebarHidden(true))} className='logged-in-dropdown' trigger={userMenuMobile} icon={caretIcon} item={true} style={ { width: '110%' } }>
										<Dropdown.Menu>
											{loggedInItems.map((item, index) =>
												<Link key={index} href={item.href} passHref>
													<Menu.Item as="a" {...item}/>
												</Link>
											)}
										</Dropdown.Menu>
									</Dropdown>
								</>
								:
								<>
									<Link href='/login' passHref>
										<Menu.Item as='a' className={`user_items ${router.pathname === '/login' ? 'pink_primary-text' : ''}`} content='Login' icon='sign in' href='/login' />
									</Link>
								</>
							}
						</Menu.Menu>
					</Menu>
				</Segment>

				<Segment as={Media} greaterThanOrEqual="computer">
					<Menu className={className} stackable inverted borderless>
						<Link href='/' passHref>
							<Menu.Item as='a' id='title'>
								<Image alt='Polkassembly Logo' src='/static/polkassembly-logo.png' width={160} height={54} />
							</Menu.Item>
						</Link>
						<Menu.Menu className='right-menu' position="right">

							{username && <Link href='/post/create' passHref><Menu.Item title='Create Post' as='a'><Icon className='create-post-btn' name='add circle' size='large' /></Menu.Item></Link>}

							<SearchBar className='search-bar' />
							<NetworkDropdown />
							{username
								? <>
									<Dropdown className='logged-in-dropdown' trigger={userMenu} icon={caretIcon} item={true}>
										<Dropdown.Menu>
											{loggedInItems.map((item, index) =>
												<Link key={index} href={item.href} passHref>
													<Menu.Item as="a" {...item} />
												</Link>
											)}
										</Dropdown.Menu>
									</Dropdown>
								</>
								: <>
									{loggedOutItems.map((item, index) =>
										<Link key={index} href={item.href} passHref>
											<Menu.Item as="a" className={`user_items ${router.pathname === item.href ? 'pink_primary-text' : ''}`} {...item} />
										</Link>
									)}
								</>
							}
						</Menu.Menu>
					</Menu>
				</Segment>
			</Segment.Group>
		</>
	);
};

export default styled(MenuBar)`
	#title, .item {
		cursor: pointer !important;
		padding-left: 0 !important;
		margin-left: 0 !important;
	}

	.create-post-btn {
		cursor: pointer; 
	}

	.pink_primary-text{
		color: pink_primary !important;

		i {
			color: pink_primary !important;
		}
	}

	&.ui.menu, .ui.inverted.menu {
		font-family: font_default;
		background-color: nav_black;
		border-radius: 0rem;
		letter-spacing: 0.2px;

		& a.active {
			outline: none;
			background-color: nav_black !important;
		}
		.item {
			color: grey_secondary;
			font-weight: 500;
			&:hover {
				color: white;
			}
		}

		i.icon {
			color: grey_secondary;
		}

		.logo {
			background-color: nav_black !important;
		}
	}

	.right-menu {
		display: flex;
		align-items: center;

		.search-bar {
			margin-right: 1em;

			input {
				color: #ddd;
				background: rgba(255, 255, 255, 0.25);
				border-radius: 0.7em !important;
				padding-top: 1em;
				padding-bottom: 1em;
				width: 26rem;
				font-family: 'Roboto' !important;
			}

			.results {
				width: 35.5vw !important;
				overflow-y: auto;
				height: 70vh;
			}
		}

		.logged-in-dropdown, i.icon.caret {
			color: #fff !important;
		}
	}

	@media only screen and (max-width: 992px) {
		position: fixed;
		z-index: 400;

		.sidebar-btn {
			margin-left: 20px !important;
			align-items: center;

			.icon {
				cursor: pointer;
			}
		}

		&.ui.menu, .ui.inverted.menu {
			min-height: 5rem;
			border-bottom-style: solid;
			border-bottom-width: 1px;
			border-bottom-color: grey_primary;
			margin-top: -1em;

			.desktop_items, #title {
				position: absolute;
			}

			.desktop_items, #title {
				text-align: left;
				margin: auto 0;
				left: 54px;
				top: 0.3rem;
				padding-top: 0.7rem;
				padding-bottom: 0;
				border-radius: 0.8rem!important;
			}

			#rightmenu {
				font-size: lg;
				max-width: 2rem;
				margin-right: 2rem !important;
				margin-left: 2rem !important;
			}

			.item {
				font-size: md;
				&:before {
					width: 0rem;
				}
			}

			a.item:hover {
				background: none;
				color: grey_secondary;
			}
		}

		.ui.top.sidebar {
			padding: 1rem;
			border-radius: 0rem!important;
			position: relative;
			.item {
				float: left;
				clear: both;
				text-align: left;
				border-radius: 0.8rem!important;
			}
		}

		.ui.icon.menu .item {
			text-align: left;
			padding: 1.5rem 1rem;
			&>.icon:not(.dropdown) {
				font-size: 1.6rem!important;
				display: inline-block;
				margin: 0 1.2rem auto 0 !important;
			}
		}
	}

	@media only screen and (min-width: 992px) {
		&.ui.menu {
			padding: 0.5rem 2rem;
			font-size: md;
			.item {
				padding: 0.5rem 0.5rem;
				margin: 0 1.2rem;
				:hover {
					background-color: nav_black !important;
				}
			}

			.ui.dropdown .menu>.item,
			.ui.dropdown .menu>.active.item {
				font-size: md!important;
				font-weight: 400 !important;
			}
		}

		.desktop_items, .user_items, #title {
			i.icon {
				display: none;
			}
			i.icon.caret {
				display: block;
			}
		}

	}

	&.ui.inverted.menu a.item:hover, &.ui.inverted.menu .dropdown.item:hover {
		border-radius: 0.5rem;
	}
`;
