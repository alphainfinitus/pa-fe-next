// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import gql from 'graphql-tag';

import { authorFields } from '../../../fragments/author';

export const QUERY_TRACKER_REFERENDA = gql`
    query TrackerReferendaPosts($postType: Int!, $onchainReferendumIds: [Int!]!) {
        posts(where: {
            type: {
                id: {
                    _eq: $postType
                }
            },
            onchain_link: {
                onchain_referendum_id: {
                    _in: $onchainReferendumIds
                }
            }
        }, order_by: {
            onchain_link: {
                onchain_referendum_id: desc
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
                onchain_referendum_id
                onchain_referendum(where: {}) {
                    id
                    end
                    referendumStatus(last: 1) {
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
