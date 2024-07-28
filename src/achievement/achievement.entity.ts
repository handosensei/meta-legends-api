import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserAchievement } from '@src/user-achievement/user-achievement.entity';

@Entity()
export class Achievement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 63 })
  category: string;

  @Column('varchar', { length: 63 })
  code: string;

  @Column('varchar', { length: 63 })
  label: string;

  @Column('varchar', { length: 255, nullable: true })
  description: string;

  @OneToMany(
    () => UserAchievement,
    (userAchievement) => userAchievement.achievement,
  )
  userAchievements: UserAchievement[];
}
