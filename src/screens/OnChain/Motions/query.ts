// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import gql from 'graphql-tag';

import { authorFields } from '../../../fragments/author';

// for motions postType shoud be 2, postTopic should be 2
export const QUERY_LATEST_MOTIONS = gql`
    query GetLatestMotionPosts($postType: Int!, $limit: Int! = 5 ) {
        posts(limit: $limit, where: {
            type: {
                id: {
                    _eq: $postType
                }
            },
            onchain_link: {
                onchain_motion_id: {
                    _is_null: false
                },
            }
        }, order_by: {
            onchain_link: {
                onchain_motion_id: desc
            }
        }) {
            id
            title
            author {
                ...authorFields
            }
            created_at
            updated_at
            comments_aggregate {
                aggregate {
                    count
                }
            }
            type {
                name
                id
            }
            topic {
                id
                name
            }
            onchain_link {
                id
                onchain_motion_id
                onchain_motion {
                    id
                    motionStatus(last: 1) {
                        id
                        status
                    }
                    preimage {
                        id
                        method
                    }
                }
                proposer_address
            }
        }
    }
    ${authorFields}
`;

export const QUERY_COUNT_MOTIONS = gql`
    query GetLatestMotionsCount($postType: Int!) {
        posts_aggregate(where: {type: {id: {_eq: $postType}}, onchain_link: {onchain_motion_id: {_is_null: false}}}) {
            aggregate {
                count
            }
        }
    }
`;
