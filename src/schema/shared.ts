import { gql } from 'apollo-server-express';

export default gql`
  type Query {
    ping: String!
    getEmergencyAlert(input: SignUpInputLocation!): [Emergency!]
  }

  union AnyUser = User | PriorityUser | Admin

  enum AllowedRole {
    USER
    PRIORITY_USER
    ADMIN
  }

  interface MutationResponse {
    code: String!
    message: String!
  }

  interface BaseUser {
    id: ID!
    name: String!
    email: String!
    phone: String!
    verified: Boolean!
    roles: [AllowedRole!]!
    timeSt: String!
    location: Location!
  }
`;
