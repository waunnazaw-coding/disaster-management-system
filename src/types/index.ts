export type Role = 'User' | 'ReliefTeam' | 'Organization' | 'Admin';

export const rolePanelMap: Record<Role, string> = {
  User: '/public',
  ReliefTeam: '/relief',
  Organization: '/organization',
  Admin: '/admin',
};