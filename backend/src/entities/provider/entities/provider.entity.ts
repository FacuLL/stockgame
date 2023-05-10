import { fields } from "src/constants/fields.constants";
import { Asset } from "src/entities/asset/entities/asset.entity";
import { Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CreateProviderDto } from "../dto/create-provider.dto";
import { UpdateProviderDto } from "../dto/update-provider.dto";

export class Provider {
    @PrimaryGeneratedColumn()
    providerid: number;
    @Column({ length: fields.name.max })
    name: string;
    @Column()
    url: string;
    @Column()
    assetendpoint: string;
    @OneToMany(() => Asset, (asset) => asset.provider)
    assets: Asset[];

    constructor(data: CreateProviderDto) {
        for (let property in data) {
            this[property] = data[property];
        }
    }
    
    updateData(data: UpdateProviderDto): void {
        for (let property in data) {
            this[property] = data[property];
        }
    }
}
