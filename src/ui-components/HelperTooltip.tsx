// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import Image from 'next/image';
import React from 'react';
import { Popup } from 'semantic-ui-react';

const popupStyle = {
	fontSize: '1.2rem',
	marginLeft: '-1rem'
};

const myIcon = ({ className }:{className?: string}) => <Image width={15} height={15} className={className} src='/static/InfoCircle.png' alt='(i)' />;

export const StyledIcon = styled(myIcon)`
	margin-top: 0.055em !important;
`;

interface Props {
	content: string
	position?: 'top left' | 'top right' | 'bottom right' | 'bottom left' | 'right center' | 'left center' | 'top center' | 'bottom center' | undefined
	basic?: boolean,
	iconSize?: 'small' | 'normal'
}

const HelperTooltip = ({ content, position, basic = false, iconSize }:Props) =>
	<Popup
		trigger={<span><StyledIcon className={ iconSize } /></span>}
		content={content}
		style={popupStyle}
		hoverable={true}
		position={position}
		basic={basic}
		hideOnScroll
	/>;

export default HelperTooltip;
