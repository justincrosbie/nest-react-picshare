import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Picture } from '../pictures/picture.entity';
import { Favorite } from '../pictures/favourite.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @OneToMany(() => Picture, (picture) => picture.user)
  pictures: Picture[];

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];
}
