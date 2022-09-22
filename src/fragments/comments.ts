// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import gql from 'graphql-tag';

import { authorFields } from './author';

export const replyFields = gql`
    fragment replyFields on replies {
        id
        author {
            ...authorFields
        }
        comment_id
        content
        created_at
        updated_at
    }
    ${authorFields}
`;

export const commentFields = gql`
    fragment commentFields on comments {
        id
        author {
            ...authorFields
        }
        replies {
            ...replyFields
        }
        content
        created_at
        updated_at
    }
    ${authorFields}
    ${replyFields}
`;