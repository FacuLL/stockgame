import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Provider } from "src/entities/provider/entities/provider.entity";
import { Asset } from "src/entities/asset/entities/asset.entity";
import { CreateHistoricalAssetDto } from "../dto/create-historicalasset.dto";

@Index("historicalassetid_UNIQUE", ["historicalassetid"], { unique: true })
@Entity("historicalasset", { schema: "marketgame" })
export class HistoricalAsset {
  @PrimaryGeneratedColumn()
  historicalassetid: number;

  @CreateDateColumn()
  date: Date;

  @Column("decimal", { precision: 9, scale: 2 })
  open: string;

  @Column("decimal", { precision: 9, scale: 2 })
  close: string;

  @Column("decimal", { precision: 9, scale: 2 })
  volume: string;

  @Column("decimal", { precision: 9, scale: 2 })
  high: string;

  @Column("decimal", { precision: 9, scale: 2 })
  low: string;

  @ManyToOne(() => Asset, asset => asset.historical)
  asset: Asset

  @ManyToOne(() => Provider, { nullable: true })
  provider?: Provider;

  constructor(data: CreateHistoricalAssetDto, date: Date, asset: Asset, provider?: Provider) {
    for (let property in data) {
      this[property] = data[property];
    }
    this.date = date;
    this.asset = asset;
    if (provider) this.provider = provider;
  }
}
