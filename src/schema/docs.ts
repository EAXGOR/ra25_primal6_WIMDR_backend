import { gql } from 'apollo-server-express';

export default gql`
  type Doc {
    id: ID!
    desc: String!
    filename: String!
    mime: String!
    url: String!
    createdBy: AnyUser!
    emergency: Emergency
  }
`;
