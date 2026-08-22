import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

export interface GithubProfileInput {
  githubId: string;
  username: string;
  avatarUrl: string | null;
  email: string | null;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  findById(id: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id } });
  }

  findByGithubId(githubId: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { githubId } });
  }

  async findOrCreateFromGithub(profile: GithubProfileInput): Promise<User> {
    const existing = await this.findByGithubId(profile.githubId);

    if (existing) {
      existing.username = profile.username;
      existing.avatarUrl = profile.avatarUrl;
      existing.email = profile.email;
      return this.usersRepo.save(existing);
    }

    const newUser = this.usersRepo.create(profile);
    return this.usersRepo.save(newUser);
  }
}
