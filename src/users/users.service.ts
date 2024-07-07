import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import type { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.entity';
import type { Repository, UpdateResult } from 'typeorm';
import { v4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(userDTO: CreateUserDTO) {
    const salt: string = await bcrypt.genSalt();
    userDTO.password = await bcrypt.hash(userDTO.password, salt);

    let user: User = new User();
    user = { ...user, ...userDTO };
    user.apiKey = v4();

    const savedUser: User = await this.userRepository.save(user);
    delete savedUser.password;
    return savedUser;
  }

  async findByEmail(data: Partial<User>): Promise<User> {
    const user: User = await this.userRepository.findOneBy({
      email: data.email,
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async updateSecretKey(userId: number, secret: string): Promise<UpdateResult> {
    return this.userRepository.update(
      { id: userId },
      { twoFASecret: secret, enable2FA: true },
    );
  }

  async disable2FA(userId: number): Promise<UpdateResult> {
    return this.userRepository.update(
      { id: userId },
      { twoFASecret: null, enable2FA: false },
    );
  }

  async findByApiKey(apiKey: string): Promise<User> {
    return this.userRepository.findOneBy({ apiKey });
  }
}
