

export interface JwtPayload {
    email: string,
    sub: string,  
    role: { 
      name: string; 
      claims: { 
        action: string; 
        subject: string; 
        conditions?: Record<string, any>; 
      }[];
    }
  }