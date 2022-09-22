// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import gql from 'graphql-tag';

import { authorFields } from '../../fragments/author';
import { commentFields } from '../../fragments/comments';

const onchainLinkTip = gql`
    fragment onchainLinkTip on onchain_links {
        id,
        proposer_address,
        onchain_tip_id,
        onchain_tip(where: {}) {
            id
            hash
            reason
            who
            finder
            finderFee
            closes
            tipStatus(orderBy: id_DESC) {
                id
                status
                blockNumber {
                    startDateTime
                    number
                }
            }
        }
    }
`;

const tipPost = gql`
    fragment tipPost on posts {
        author {
            ...authorFields
        }
        content
        created_at
        id
        updated_at
        comments(order_by: {created_at: asc}) {
            ...commentFields
        }
        onchain_link{
            ...onchainLinkTip
        }
        title
        topic {
            id
            name
        }
        type {
            id
            name
        }
    }
    ${authorFields}
    ${commentFields}
    ${onchainLinkTip}
`;

export const QUERY_TIP_POST_AND_COMMENTS = gql`
    query TipPostAndComments ($hash:String!) {
        posts(where: {onchain_link: {onchain_tip_id: {_eq: $hash}}}) {
            ...tipPost
        }
    }
    ${tipPost}
`;

