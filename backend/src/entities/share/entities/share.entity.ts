import { Column, CreateDateColumn, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Asset } from "src/entities/asset/entities/asset.entity";
import { CreateShareDto } from "../dto/create-share.dto";
import { Currency } from "src/entities-generator/Currency";

@Index("shareid_UNIQUE", ["shareid"], { unique: true })
@Entity("share", { schema: "marketgame" })
export class Share {
  @PrimaryGeneratedColumn()
  shareid: number;

  @OneToOne(() => Asset)
  @JoinColumn()
  asset: Asset;

  @ManyToOne(() => Currency)
  @JoinColumn()
  currency: Currency;

  constructor(data: CreateShareDto, asset: Asset, currency: Currency) {
    for (let property in data) {
      this[property] = data[property];
    }
    this.asset = asset;
  }
}
