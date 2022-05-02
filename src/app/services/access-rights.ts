import {Role} from "./role";

export const ACCESS_RIGHTS = [
  {path: '/', roles: [Role.GUEST, Role.USER, Role.MODERATOR, Role.ADMIN, Role.SUPER_ADMIN]},
  {path: '/login', roles: [Role.GUEST]},
  {path: '/ressource', roles: [Role.USER, Role.MODERATOR, Role.ADMIN, Role.SUPER_ADMIN]},
  {path: '/users', roles: [Role.USER, Role.MODERATOR, Role.ADMIN, Role.SUPER_ADMIN]},
  {path: '/dashboard', roles: [Role.USER, Role.MODERATOR, Role.ADMIN, Role.SUPER_ADMIN]},
]

