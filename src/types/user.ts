export interface User {
  id: string;
  email: string;
  username: string;
  role: {
    id: string;
    roleName?: string;
  };
}
