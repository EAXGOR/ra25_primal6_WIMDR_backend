import { gql } from 'apollo-server-express';

export default gql`
  type Location {
    id: ID!
    longitude: String!
    latitude: String!
    direction: String
    speed: String
    emergency: Emergency
    user: AnyUser
  }
`;
