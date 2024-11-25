export interface User {
    username: string;
    email: string;
    password: string;
    roles?: string[];
    isActive?: boolean;
    isDeleted?: boolean;
  }