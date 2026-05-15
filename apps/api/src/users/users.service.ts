import { Injectable } from '@nestjs/common';
import { AuthProvider, type Role, type User } from '@prisma/client';

import { UsersRepository } from './users.repository';

import type {
  CreateOAuthUserParams,
  OAuthProfile,
} from '../auth/oauth/oauth-user';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  getAllUser() {
    return 'all user';
  }

  getUserByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email);
  }

  getUserByProviderId(provider: AuthProvider, providerId: string) {
    return this.usersRepository.findByProviderId(provider, providerId);
  }

  createLocalUser(params: {
    email: string;
    passwordHash: string;
    name: string;
    role: Role;
  }): Promise<User> {
    return this.usersRepository.create({
      email: params.email,
      password: params.passwordHash,
      name: params.name,
      role: params.role,
      provider: AuthProvider.LOCAL,
    });
  }

  createOAuthUser(profile: OAuthProfile, role: Role): Promise<User> {
    const params: CreateOAuthUserParams = { ...profile, role };
    return this.usersRepository.createOAuthUser(params);
  }
}
