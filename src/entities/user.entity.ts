import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm'
@Entity()
export class User {
  // id
  @PrimaryGeneratedColumn()
  id: number
  // wxid
  @Column({ type: "varchar", length: 255 })
  wxid: string
  // 用户的昵称
  @Column({ type: "varchar", length: 255, default: '' })
  nick_name: string
  // 机器人对用户的好感度
  @Column({ type: "int", default: 0 })
  intimacy: number
  // 用户货币数量
  @Column({ type: "int", default: 0 })
  point: number
  // 用户背包
  @Column({ type: "varchar", default: '[]' })
  bag: string
  // 签到次数
  @Column({ type: "int", default: 0 })
  signin_times: number
  // 今日是否签到
  @Column({ type: "int", default: 0 })
  is_signin: number
  // 用户信息更新时间
  @UpdateDateColumn({ type: "timestamp" })
  update_time: Date
  // 用户信息创建时间
  @CreateDateColumn({ type: "timestamp" })
  create_time: Date
}