import { Body, ClassSerializerInterceptor, Controller, Req, UseInterceptors } from "@nestjs/common";
import { GameState } from "./GameState";
import { Get } from "@nestjs/common";
import { GameDto } from "./dto/game.dto";
import { User } from "src/user/User";
import { GameService } from "./game.service";

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  private applyActionToGame(action: string, body: GameDto): GameState {
    const game = new GameState();
    game.applyDto(body);

    const user = new User();
    if (action === 'leftPaddleUp' || action === 'leftPaddleDown') {
      game.user1 = user;
    } else {
      game.user2 = user;
    }

    switch (action) {
      case 'leftPaddleUp':
      case 'rightPaddleUp':
        game.movePaddleUp(user);
        break;
      case 'leftPaddleDown':
      case 'rightPaddleDown':
        game.movePaddleDown(user);
        break;
      default:
        break;
    }

    return game;
  }

  /* ==== ENDPOINTS ==== */

  // curl -X GET -k https://localhost:3000/game/update
  @Get('initialize')
  initializeApiGame() {
    const newGame = new GameState();
    return newGame.toDto("");
  }

  @Get('paddle')
  movePaddle(@Body() body: GameDto, @Req() req: Request) {
    const action = req.url.split('/').pop();
    const game = this.applyActionToGame(action, body);

    return game.toDto(body.winner);
  }

  // curl -X GET -k -H "Content-Type: application/json" -d '{"fieldWidth":800,"fieldHeight":400,"ballX":400,"ballY":200,"paddlesHeight":100,"leftPaddle":150,"rightPaddle":150,"scorePlayer1":0,"contactsPlayer2":0}' https://localhost:3000/game/update
  @Get('update')
  requestUpdate(@Body() body: GameDto) {
    let game = new GameState();
    let winner = "";

    game.applyDto(body);
    game.isLocalGame = true;

    game.collisionField();
    game.collisionLeft();
    game.collisionRight();

    game.ballXPrev = game.ballX;
    game.ballYPrev = game.ballY;
    game.ballX += game.ballSpeedX;
    game.ballY += game.ballSpeedY;

    if (
      game.scorePlayer1 >= game.winningScore ||
      game.scorePlayer2 >= game.winningScore
    ) {
      if (game.scorePlayer1 >= game.winningScore) {
        winner = "left";
      } else if (game.scorePlayer2 >= game.winningScore) {
        winner = "right";
      }
    }

    return game.toDto(winner);
  }
}
