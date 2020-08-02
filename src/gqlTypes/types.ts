export enum AllowedRole {
  USER = 'USER',
  PRIORITY_USER = 'PRIORITY_USER',
  ADMIN = 'ADMIN',
}

export enum EmergencyStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  COMPLETED = 'COMPLETED',
}

export type AnyUser = User | PriorityUser | Admin;

export interface Doc {
  id: string;
  desc: string;
  filename: string;
  mime: string;
  url: string;
  createdBy: Partial<AnyUser>;
  emergency: Partial<Emergency>;
}

export interface Location {
  id: string;
  longitude: string;
  latitude: string;
  direction: string;
  speed: string;
  user: Partial<AnyUser>;
  emergency: Partial<Emergency>;
}

export interface Emergency {
  id: string;
  location: Partial<Location>;
  status: EmergencyStatus;
  raisedBy: Partial<AnyUser>;
  handledBy: Partial<PriorityUser>;
  previousAssignees: Partial<PriorityUser>[];
  active: boolean;
  docs: Partial<Doc>[];
  description: string;
}

export interface BaseUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  verified: boolean;
  roles: AllowedRole[];
  timeSt: string;
  location: Partial<Location>;
}

export type User = BaseUser & {
  emergenciesCreated: Partial<Emergency>[];
};

export type Admin = BaseUser & {
  emergenciesCreated: Partial<Emergency>[];
  validatedUsers: Partial<AnyUser>[];
  docs: Partial<Doc>[];
  validatedBy: Partial<Admin>;
};

export type PriorityUser = BaseUser & {
  emergenciesCreated: Partial<Emergency>[];
  emergenciedhandled: Partial<Emergency>[];
  docs: Partial<Doc>[];
  validatedBy: Partial<Admin>;
  emergencyRequests: Partial<Emergency>[];
  currentEmergency: Partial<Emergency>;
};
