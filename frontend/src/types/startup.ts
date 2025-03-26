export interface TeamMember {
  name: string;
  role: string;
  email: string;
  linkedIn: string;
}

export interface Startup {
  _id?: string;
  user?: string;
  startupName: string;
  industry: string;
  fundingGoal: number;
  raisedSoFar: number;
  description: string;
  startupLogo: string;
  website: string;
  address: string;
  email: string;
  mobile: string;
  team: TeamMember[];
  __v?: number;
}