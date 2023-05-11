import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { fields } from "src/constants/fields.constants";
import { AssetToGame } from "src/relations/entities/asset-game.entity";
import { Provider } from "src/entities/provider/entities/provider.entity";
import { CreateAssetDto } from "../dto/create-asset.dto";
import { UpdateAssetDto } from "../dto/update-asset.dto";
import { Currency } from "src/entities/currency/entities/currency.entity";

@Index("assetid_UNIQUE", ["assetid"], { unique: true })
@Entity("asset", { schema: "marketgame" })
export class Asset {
  @PrimaryGeneratedColumn()
  assetid: number;

  @Column()
  code: string;

  @Column({ length: fields.name.max })
  name: string;

  @Column("decimal", { precision: 9, scale: 2 })
  quotation: number;

  @Column()
  automatized: boolean;

  @Column({ nullable: true })
  image?: string;

  @Column()
  available: boolean;

  @Column({ precision: 9, scale: 2 })
  dayhigh: string;

  @Column({ precision: 9, scale: 2 })
  daylow: string;

  @CreateDateColumn()
  lastupdate: Date;

  @OneToMany(() => AssetToGame, (assetgame) => assetgame.asset)
  games: AssetToGame[];

  @ManyToOne(() => Currency, { nullable: true })
  @JoinColumn()
  currency: Currency;

  @ManyToOne(() => Provider, (provider) => provider.assets)
  @JoinColumn()
  provider: Provider;

  constructor(data: CreateAssetDto, provider: Provider, currency?: Currency) {
    for (let property in data) {
      this[property] = data[property];
    }
    this.provider = provider;
    if (currency) this.currency = currency;
  }

  updateData(data: UpdateAssetDto): void {
    for (let property in data) {
      this[property] = data[property];
    }
  }
}
