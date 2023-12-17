import { PrismaService } from './prisma/prisma.service';
import { AuthService } from './auth/auth.service';
import { User } from './auth/interfaces/user.interface';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Users } from '@prisma/client';
import * as argon from 'argon2';

async function seed() {
  const config = new ConfigService();
  const prisma = new PrismaService(config);
  const jwt = new JwtService();
  const auth = new AuthService(prisma, jwt, config);

  try {
    // Delete all tables
    // await prisma.avatars.deleteMany({
    //   where: {
    //     NOT: {
    //       id: 1,
    //     },
    //   },
    // });
    // await prisma.friends.deleteMany({});
    // await prisma.tournaments.deleteMany({});
    // await prisma.games.deleteMany({});
    await prisma.users.deleteMany({});

    await prisma.createNewAvatar('.png');

    // Create users
    let authuser1: User = { id: 1, password: 'a', username: 'a' };
    let authuser2: User = { id: 2, password: 'b', username: 'b' };
    let authuser3: User = { id: 3, password: 'c', username: 'c' };
    let authuser4: User = { id: 4, password: 'd', username: 'd' };
    let authuser5: User = { id: 5, password: 'e', username: 'e' };
    let authuser6: User = { id: 6, password: 'f', username: 'f' };
    let authuser7: User = { id: 7, password: 'g', username: 'g' };
    let authuser8: User = { id: 8, password: 'h', username: 'h' };

    let user1: Users = await prisma.createUserBySignUp(
      authuser1.username,
      await argon.hash(authuser1.password),false
    );
    let user2: Users = await prisma.createUserBySignUp(
      authuser2.username,
      await argon.hash(authuser2.password),false
    );
    let user3: Users = await prisma.createUserBySignUp(
      authuser3.username,
      await argon.hash(authuser3.password),false
    );
    let user4: Users = await prisma.createUserBySignUp(
      authuser4.username,
      await argon.hash(authuser4.password),false
    );
    let user5: Users = await prisma.createUserBySignUp(
      authuser5.username,
      await argon.hash(authuser5.password),false
    );
    let user6: Users = await prisma.createUserBySignUp(
      authuser6.username,
      await argon.hash(authuser6.password),false
    );
    let user7: Users = await prisma.createUserBySignUp(
      authuser7.username,
      await argon.hash(authuser7.password),false
    );
    let user8: Users = await prisma.createUserBySignUp(
      authuser8.username,
      await argon.hash(authuser8.password),false
    );

    //Play 8 Queued Games
    // const game1 = await prisma.createNewGame(user1.id, user2.id);
    // await prisma.updateGameScore(game1.id, 11, 5, user1.id, 10, 52, 51);
    // const game2 = await prisma.createNewGame(user1.id, user2.id);
    // await prisma.updateGameScore(game2.id, 4, 11, user2.id, 5, 32, 28);
    // const game3 = await prisma.createNewGame(user3.id, user2.id);
    // await prisma.updateGameScore(game3.id, 11, 7, user3.id, 7, 42, 38);
    // const game4 = await prisma.createNewGame(user3.id, user4.id);
    // await prisma.updateGameScore(game4.id, 10, 11, user4.id, 2, 12, 10);

    // const game5 = await prisma.createNewGame(user5.id, user6.id);
    // await prisma.updateGameScore(game5.id, 11, 9, user5.id, 4, 25, 22);
    // const game6 = await prisma.createNewGame(user5.id, user6.id);
    // await prisma.updateGameScore(game6.id, 2, 11, user6.id, 4, 28, 24);
    // const game7 = await prisma.createNewGame(user7.id, user6.id);
    // await prisma.updateGameScore(game7.id, 11, 4, user7.id, 7, 33, 48);
    // const game8 = await prisma.createNewGame(user7.id, user8.id);
    // await prisma.updateGameScore(game8.id, 1, 11, user8.id, 13, 62, 76);

    //Play 4 Tournaments
    // const game9 = await prisma.createNewGame(user1.id, user2.id);
    // await prisma.updateGameScore(game9.id, 11, 8, user1.id, 9, 42, 55);
    // const game10 = await prisma.createNewGame(user3.id, user4.id);
    // await prisma.updateGameScore(game10.id, 7, 11, user4.id, 8, 42, 40);
    // const game11 = await prisma.createNewGame(user1.id, user4.id);
    // await prisma.updateGameScore(game11.id, 11, 9, user1.id, 6, 34, 38);
    // const tour1 = await prisma.createNewTournament(
    //   game9.id,
    //   game10.id,
    //   game11.id,
    //   user1.id,
    // );

    // const game12 = await prisma.createNewGame(user1.id, user3.id);
    // await prisma.updateGameScore(game12.id, 11, 3, user1.id, 5, 29, 35);
    // const game13 = await prisma.createNewGame(user2.id, user4.id);
    // await prisma.updateGameScore(game13.id, 5, 11, user4.id, 14, 73, 75);
    // const game14 = await prisma.createNewGame(user4.id, user1.id);
    // await prisma.updateGameScore(game14.id, 11, 4, user4.id, 11, 64, 55);
    // const tour2 = await prisma.createNewTournament(
    //   game12.id,
    //   game13.id,
    //   game14.id,
    //   user4.id,
    // );

    // const game15 = await prisma.createNewGame(user5.id, user6.id);
    // await prisma.updateGameScore(game15.id, 11, 6, user5.id, 9, 43, 57);
    // const game16 = await prisma.createNewGame(user7.id, user8.id);
    // await prisma.updateGameScore(game16.id, 10, 11, user8.id, 5, 36, 23);
    // const game17 = await prisma.createNewGame(user5.id, user8.id);
    // await prisma.updateGameScore(game17.id, 11, 7, user5.id, 6, 45, 23);
    // const tour3 = await prisma.createNewTournament(
    //   game15.id,
    //   game16.id,
    //   game17.id,
    //   user5.id,
    // );

    //Add Firends
    // await prisma.addFriendByIds(user1.id, user2.id);
    // await prisma.addFriendByIds(user1.id, user3.id);
    // await prisma.addFriendByIds(user1.id, user4.id);
    // await prisma.addFriendByIds(user2.id, user4.id);
    // await prisma.addFriendByIds(user3.id, user1.id);
    // await prisma.addFriendByIds(user3.id, user4.id);
    // await prisma.addFriendByIds(user7.id, user4.id);
    // await prisma.addFriendByIds(user8.id, user6.id);
    // await prisma.addFriendByIds(user6.id, user8.id);
    // await prisma.addFriendByIds(user3.id, user7.id);
  } catch (error) {
    console.error('Error in seeding:', error);
  } finally {
    await prisma.$disconnect(); // Disconnect PrismaClient after seeding
  }
}

seed();
