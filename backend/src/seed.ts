import { PrismaService } from "./prisma/prisma.service";
import { AuthService } from "./auth/auth.service";
import { User } from "./auth/interfaces/user.interface";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Users } from "@prisma/client";


async function seed() {
  const config = new ConfigService();
  const prisma = new PrismaService(config);
  const jwt = new JwtService();
  const auth = new AuthService(prisma, jwt,config);

  try {
    // Delete all tables
    await prisma.friends.deleteMany({});
    await prisma.tournaments.deleteMany({});
    await prisma.games.deleteMany({});
    await prisma.users.deleteMany({});

    // Create users
    let authuser1: User = { id: 1, password: "a", username: "a" };
    let authuser2: User = { id: 2, password: "b", username: "b" };
    let authuser3: User = { id: 3, password: "c", username: "c" };
    let authuser4: User = { id: 4, password: "d", username: "d" };
    let authuser5: User = { id: 5, password: "e", username: "e" };
    let authuser6: User = { id: 6, password: "f", username: "f" };
    let authuser7: User = { id: 7, password: "g", username: "g" };
    let authuser8: User = { id: 8, password: "h", username: "h" };

    let user1: Users = await prisma.createUserBySignUp(authuser1.username, await auth.signToken(authuser1.id, authuser1.username));
    let user2: Users = await prisma.createUserBySignUp(authuser2.username, await auth.signToken(authuser2.id, authuser2.username));
    let user3: Users = await prisma.createUserBySignUp(authuser3.username, await auth.signToken(authuser3.id, authuser3.username));
    let user4: Users = await prisma.createUserBySignUp(authuser4.username, await auth.signToken(authuser4.id, authuser4.username));
    let user5: Users = await prisma.createUserBySignUp(authuser5.username, await auth.signToken(authuser5.id, authuser5.username));
    let user6: Users = await prisma.createUserBySignUp(authuser6.username, await auth.signToken(authuser6.id, authuser6.username));
    let user7: Users = await prisma.createUserBySignUp(authuser7.username, await auth.signToken(authuser7.id, authuser7.username));
    let user8: Users = await prisma.createUserBySignUp(authuser8.username, await auth.signToken(authuser8.id, authuser8.username));

    //Play 8 Queued Games
    const game1 = await prisma.createNewGame(user1.id, user2.id);
    await prisma.updateGameScore(game1.id, 11, 5, user1.id);
    const game2 = await prisma.createNewGame(user1.id, user2.id);
    await prisma.updateGameScore(game2.id, 4, 11, user2.id);
    const game3 = await prisma.createNewGame(user3.id, user2.id);
    await prisma.updateGameScore(game3.id, 11, 7, user3.id);
    const game4 = await prisma.createNewGame(user3.id, user4.id);
    await prisma.updateGameScore(game4.id, 10, 11, user4.id);

    const game5 = await prisma.createNewGame(user5.id, user6.id);
    await prisma.updateGameScore(game5.id, 11, 9, user5.id);
    const game6 = await prisma.createNewGame(user5.id, user6.id);
    await prisma.updateGameScore(game6.id, 2, 11, user6.id);
    const game7 = await prisma.createNewGame(user7.id, user6.id);
    await prisma.updateGameScore(game7.id, 11, 4, user7.id);
    const game8 = await prisma.createNewGame(user7.id, user8.id);
    await prisma.updateGameScore(game8.id, 1, 11, user8.id);


    //Play 4 Tournaments
    const game9 = await prisma.createNewGame(user1.id, user2.id);
    await prisma.updateGameScore(game9.id, 11, 8, user1.id);
    const game10 = await prisma.createNewGame(user3.id, user4.id);
    await prisma.updateGameScore(game10.id, 7, 11, user4.id);
    const game11 = await prisma.createNewGame(user1.id, user4.id);
    await prisma.updateGameScore(game11.id, 11, 9, user1.id);
    const tour1 = await prisma.createNewTournament(game9.id, game10.id, game11.id, user1.id);

    const game12 = await prisma.createNewGame(user1.id, user3.id);
    await prisma.updateGameScore(game12.id, 11, 3, user1.id);
    const game13 = await prisma.createNewGame(user2.id, user4.id);
    await prisma.updateGameScore(game13.id, 5, 11, user4.id);
    const game14 = await prisma.createNewGame(user4.id, user1.id);
    await prisma.updateGameScore(game14.id, 11, 4, user4.id);
    const tour2 = await prisma.createNewTournament(game12.id, game13.id, game14.id, user4.id);

    const game15 = await prisma.createNewGame(user5.id, user6.id);
    await prisma.updateGameScore(game15.id, 11, 6, user5.id);
    const game16 = await prisma.createNewGame(user7.id, user8.id);
    await prisma.updateGameScore(game16.id, 10, 11, user8.id);
    const game17 = await prisma.createNewGame(user5.id, user8.id);
    await prisma.updateGameScore(game17.id, 11, 7, user5.id);
    const tour3 = await prisma.createNewTournament(game15.id, game16.id, game17.id, user5.id);

    //Add Firends
    await prisma.addFriendByIds(user1.id, user2.id);
    await prisma.addFriendByIds(user1.id, user3.id);
    await prisma.addFriendByIds(user1.id, user4.id);
    await prisma.addFriendByIds(user2.id, user4.id);
    await prisma.addFriendByIds(user3.id, user1.id);
    await prisma.addFriendByIds(user3.id, user4.id);
    await prisma.addFriendByIds(user7.id, user4.id);
    await prisma.addFriendByIds(user8.id, user6.id);
    await prisma.addFriendByIds(user6.id, user8.id);
    await prisma.addFriendByIds(user3.id, user7.id);

  } catch (error) {
    console.error('Error in seeding:', error);
  } finally {
    await prisma.$disconnect(); // Disconnect PrismaClient after seeding
  }
}

seed();