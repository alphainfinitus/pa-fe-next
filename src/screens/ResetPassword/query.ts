// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import gql from 'graphql-tag';

export const MUTATION_RESET_PASSWORD = gql`
    mutation resetPassword($newPassword: String!, $userId: Int! $token: String!){
        resetPassword(newPassword: $newPassword, userId: $userId, token: $token){
            message
        }
    }
`;
