import { Column, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Asset } from "src/entities/asset/entities/asset.entity";
import { CreateCurrencyDto } from "../dto/create-currency.dto";
import { UpdateCurrencyDto } from "../dto/update-currency.dto";

@Index("currencyid_UNIQUE", ["currencyid"], { unique: true })
@Entity("currency", { schema: "marketgame" })
export class Currency {
  @PrimaryGeneratedColumn()
  currencyid: number;

  @Column()
  main: boolean;

  @OneToOne(() => Asset)
  @JoinColumn()
  asset: Asset;

  constructor(data: CreateCurrencyDto, asset: Asset) {
    for (let property in data) {
      this[property] = data[property];
    }
    this.asset = asset;
  }

  updateData(data: UpdateCurrencyDto): void {
    for (let property in data) {
      this[property] = data[property];
    }
  }
}
