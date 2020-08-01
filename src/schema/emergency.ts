import { gql } from 'apollo-server-express';

export default gql`
  extend type Mutation {
    createEmergency(input: CreateEmergencyInput): CreateEmergencyResponse!
    handleEmergency(input: HandleEmergencyInput): HandleEmergencyResponse!
    completeEmergency(input: HandleEmergencyInput): HandleEmergencyResponse!
  }

  input HandleEmergencyInput {
    emergencyID: String!
  }

  input CreateEmergencyInput {
    location: SignUpInputLocation!
    description: String!
    docs: [DocInput!]
    self: Boolean!
  }

  input DocInput {
    filename: String!
    url: String!
  }

  type CreateEmergencyResponse implements MutationResponse {
    code: String!
    message: String!
    emergency: Emergency!
  }
  type HandleEmergencyResponse implements MutationResponse {
    code: String!
    message: String!
    emergency: Emergency!
  }

  enum EmergencyStatus {
    PENDING
    ACCEPTED
    COMPLETED
  }

  type Emergency {
    id: ID!
    location: Location!
    status: EmergencyStatus!
    raisedBy: AnyUser!
    handledBy: PriorityUser
    previousAssignees: [PriorityUser]
    active: Boolean!
    description: String!
    docs: [Doc!]
  }
`;
