// Types/Member.model.ts
export interface IMember {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'member';
    avatar?: string;
    joinedAt: string;
  }
  
  export interface AddMemberData {
    projectID: string;
    userID: string;
  }
  
  export interface RemoveMemberData {
    projectID: string;
    userID: string;
  }