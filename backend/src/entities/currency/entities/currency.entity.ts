import { Column, CreateDateColumn, Entity, Index, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Asset } from "src/entities/asset/entities/asset.entity";
import { CreateCurrencyDto } from "../dto/create-currency.dto";

@Index("currency_UNIQUE", ["currency"], { unique: true })
@Entity("currency", { schema: "marketgame" })
export class Currency {
  @PrimaryGeneratedColumn()
  currencyid: number;

  @OneToOne(() => Asset)
  @JoinColumn()
  asset: Asset;

  constructor(data: CreateCurrencyDto, asset: Asset) {
    for (let property in data) {
      this[property] = data[property];
    }
    this.asset = asset;
  }
}
