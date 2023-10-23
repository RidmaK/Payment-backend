import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/createUser.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  // Find user by user id
  async findById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneBy({
        id: id,
      });
    } catch (err) {
      //   this.logger.error(`Find By Id User Error: ${err}`);
      throw new Error(`Find By Id User Error: ${err}`);
    }
  }

  // Create User
  async createUser(createUserDto: CreateUserDto) {
    try {
      const { first_name, last_name, email, password } = createUserDto;

      const user = this.userRepository.create({
        first_name,
        last_name,
        email,
        password,
      });

      const createdUser = await this.userRepository.save(user);

      return createdUser;
    } catch (err) {
      throw new Error(`Create user error: ${err}`);
    }
  }

  // Update user stripe customer Id
  async updateUserStripeCustomerId(customerId: string, user: User) {
    try {
      user.stripe_customer_id = customerId;
      return this.userRepository.save(user);
    } catch (err) {
      //   this.logger.error(`Failed to update user stripe customer id`, error.stack);
      throw new Error(`Update user stripe customer id error: ${err} `);
    }
  }

  // Update user stripe default payment method
  async updateUserStripeDefaultPaymentMethod(
    paymentMethodId: string,
    user: User,
  ) {
    try {
      user.stripe_default_payment_method = paymentMethodId;
      return this.userRepository.save(user);
    } catch (err) {
      throw new Error(`Method not implemented : ${err}`);
    }
  }

  // Update user
  async updateUser(user: User) {
    try {
      const createdUser = await this.userRepository.save(user);
      return createdUser;
    } catch (err) {
      throw new Error(`${new Date().getTime()} Update User Error: ${err}`);
    }
  }
}
