// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import Post from '../../components/Post/Post';
import { useBountyPostAndCommentsQuery } from '../../generated/graphql';
import FilteredError from '../../ui-components/FilteredError';
import Loader from '../../ui-components/Loader';

interface Props {
  id: number
}

const BountyPost = (props:Props)  => {
	const { data, error, refetch } = useBountyPostAndCommentsQuery({ variables: { 'id': props.id } });

	if (error?.message) return <FilteredError text={error.message}/>;

	if (data) return <Post data={data} isBounty refetch={refetch} />;

	return <Loader/>;
};

export default BountyPost;