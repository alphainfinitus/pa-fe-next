// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import gql from 'graphql-tag';

import { authorFields } from '../../../fragments/author';

export const QUERY_TRACKER_PROPOSALS = gql`
    query TrackerDemocracyProposalPosts($postType: Int!, $onchainProposalIds: [Int!]! ) {
        posts(where: {
            type: {
                id: {
                    _eq: $postType
                }
            },
            onchain_link: {
                onchain_proposal_id: {
                    _in: $onchainProposalIds
                },
            }
        }, order_by: {
            onchain_link: {
                onchain_proposal_id: desc
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
                onchain_proposal_id
                onchain_proposal(where: {}) {
                    id
                    proposalStatus(last: 1) {
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
