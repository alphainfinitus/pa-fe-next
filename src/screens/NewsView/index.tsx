// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React, { useEffect, useState } from 'react';
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import Grid from 'semantic-ui-react/dist/commonjs/collections/Grid';
import { chainLinks } from 'src/global/networkConstants';
import getNetwork from 'src/util/getNetwork';

const network = getNetwork();

const NewsView = ({ className } : {className?: string}) => {
	const [verticalHeight, setVerticalHeight] = useState<number | undefined>(undefined);
	useEffect(() => {
		if (typeof window !== 'undefined') {
			// detect window screen width function
			const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
			setVerticalHeight(vh);
			console.log('vh : ', vh);
		}
	}, []);

	const profile = chainLinks[network].twitter.split('/')[3];

	return ( verticalHeight ?
		<div className={className}>
			<h1>News</h1>
			<Grid stackable reversed='mobile tablet'>
				<Grid.Column className='timeline-cols' mobile={16} tablet={10} computer={8}>
					<TwitterTimelineEmbed
						sourceType="profile"
						screenName={profile}
						autoHeight={false}
						noHeader={true}
						options={
							{ height: verticalHeight - 20 }
						}
					/>
				</Grid.Column>
			</Grid>
		</div>
		: <div></div>
	);

};

export default styled(NewsView)`

	h1 {
		@media only screen and (max-width: 576px) {
			margin: 3rem 1rem 1rem 1rem;
		}

		@media only screen and (max-width: 768px) and (min-width: 576px) {
			margin-left: 1rem;
		}

		@media only screen and (max-width: 991px) and (min-width: 768px) {
			margin-left: 1rem;
		}
	}

	@media only screen and (max-width: 991px) and (min-width: 768px) {
		.ui[class*="tablet reversed"].grid {
			flex-direction: column-reverse;
		}
	}

	.timeline-col{
		height: 100px;
	}
`;
