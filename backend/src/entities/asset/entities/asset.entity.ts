import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { fields } from "src/constants/fields.constants";
import { AssetToGame } from "src/relations/entities/asset-game.entity";
import { Provider } from "src/entities/provider/entities/provider.entity";
import { CreateAssetDto } from "../dto/create-asset.dto";
import { UpdateAssetDto } from "../dto/update-asset.dto";
import { Currency } from "src/entities/currency/entities/currency.entity";
import { ConflictException } from "@nestjs/common";
import { HistoricalAsset } from "src/entities/historicalasset/entities/historicalasset.entity";

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

  @Column("decimal",{ precision: 9, scale: 2, nullable: true })
  open: string;

  @Column("decimal",{ precision: 9, scale: 2, nullable: true })
  volume: string;

  @Column("decimal",{ precision: 9, scale: 2, nullable: true })
  high: string;

  @Column("decimal",{ precision: 9, scale: 2, nullable: true })
  low: string;

  @Column("decimal",{ precision: 9, scale: 2, nullable: true })
  price: string;

  @CreateDateColumn({nullable: true})
  lastupdate: Date;

  @OneToMany(() => AssetToGame, (assetgame) => assetgame.asset)
  games: AssetToGame[];

  @ManyToOne(() => Currency, { nullable: true })
  @JoinColumn()
  currency: Currency;

  @ManyToOne(() => Provider, (provider) => provider.assets, {nullable: true})
  @JoinColumn()
  provider: Provider;

  @OneToMany(() => HistoricalAsset, historicalasset => historicalasset.asset)
  historical: HistoricalAsset[];

  constructor(data: CreateAssetDto, provider?: Provider, currency?: Currency) {
    for (let property in data) {
      this[property] = data[property];
    }
    if (this.provider) this.provider = provider;
    else if (this.automatized) throw new ConflictException('Provider required if automatization is enabled');
    if (currency) this.currency = currency;
    else this.available = false;
  }

  updateData(data: UpdateAssetDto): void {
    for (let property in data) {
      this[property] = data[property];
    }
  }
}
