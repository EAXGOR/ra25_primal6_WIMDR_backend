import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    me: User!
    getRequests: [Emergency!]
    getCurrent: Emergency
  }

  type Mutation {
    signup(input: SignUpInput): SignUpResponse
    signin(input: SignInInput): SignInResponse
    signout: SignOutResponse!
  }

  input SignInInput {
    email: String!
    password: String!
    location: SignUpInputLocation!
  }

  input SignUpInput {
    name: String!
    email: String!
    phone: String!
    location: SignUpInputLocation!
    password: String!
    priority: Boolean!
  }

  input SignUpInputLocation {
    longitude: String!
    latitude: String!
  }
  type SignUpResponse implements MutationResponse {
    code: String!
    message: String!
    user: AnyUser!
  }
  type SignOutResponse implements MutationResponse {
    code: String!
    message: String!
  }
  type SignInResponse implements MutationResponse {
    code: String!
    message: String!
  }
  type User implements BaseUser {
    id: ID!
    name: String!
    email: String!
    phone: String!
    verified: Boolean!
    roles: [AllowedRole!]!
    timeSt: String!
    emergenciesCreated: [Emergency]
    location: Location!
  }
  type PriorityUser implements BaseUser {
    id: ID!
    name: String!
    email: String!
    phone: String!
    verified: Boolean!
    roles: [AllowedRole!]!
    timeSt: String!
    emergenciesCreated: [Emergency!]
    location: Location!
    emergenciesHandled: [Emergency!]
    docs: [Doc!]!
    validatedBy: Admin!
    emergencyRequests: [Emergency!]
    currentEmergency: Emergency
  }
  type Admin implements BaseUser {
    id: ID!
    name: String!
    email: String!
    phone: String!
    verified: Boolean!
    roles: [AllowedRole!]!
    timeSt: String!
    emergenciesCreated: [Emergency!]
    location: Location!
    validatedUsers: [AnyUser!]
    docs: [Doc!]!
    validatedBy: Admin!
  }
`;
