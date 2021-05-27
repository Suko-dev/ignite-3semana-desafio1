import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return await this.repository.createQueryBuilder('games').where("games.title ILIKE :param",{param:`%${param}%`}).getMany()
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return await this.repository.query("SELECT COUNT(*) from games"); 
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    let game =  await this.repository.createQueryBuilder("games").leftJoinAndSelect("games.users","users").where("games.id = :id",{id:id}).getOne()
    if (game){
      return game.users
    }
    throw new Error("game not found");
    
  }
}
