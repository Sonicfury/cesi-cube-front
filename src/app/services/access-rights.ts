import {ERole} from "../models/role";

export const ACCESS_RIGHTS: Map<ERole, string[]> = new Map<ERole, string[]>([
  [ERole.GUEST, [
    'login',
    'register',
    'home',
    'resources/:id',
    'profiles/:id'
  ]],
  [ERole.USER, [
    'home',
    'resources/:id',
    'profiles/:id'
  ]],
  [ERole.MODERATOR, [
    'home',
    'resources/:id',
    'profiles/:id',
    'admin',
    'admin/resources/:id'
  ]],
  [ERole.ADMIN, [
    'home',
    'resources/:id',
    'profiles/:id',
    'admin',
    'admin/resources',
    'admin/profiles',
    'admin/statistics'
  ]],
  [ERole.SUPER_ADMIN, [
    'home',
    'resources/:id',
    'profiles/:id',
    'admin',
    'admin/resources',
    'admin/profiles',
    'admin/statistics'
  ]],
])
