import { Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Asset } from "src/entities/asset/entities/asset.entity";
import { CreateShareDto } from "../dto/create-share.dto";
import { UpdateShareDto } from "../dto/update-share.dto";

@Index("shareid_UNIQUE", ["shareid"], { unique: true })
@Entity("share", { schema: "marketgame" })
export class Share {
  @PrimaryGeneratedColumn()
  shareid: number;

  @OneToOne(() => Asset)
  @JoinColumn()
  asset: Asset;

  constructor(data: CreateShareDto, asset: Asset) {
    for (let property in data) {
      this[property] = data[property];
    }
    this.asset = asset;
  }

  updateData(data: UpdateShareDto): void {
    for (let property in data) {
        this[property] = data[property];
    }
  } 
}
