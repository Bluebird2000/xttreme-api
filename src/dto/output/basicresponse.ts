import { Status } from "../enums/statusenum";

export class BasicResponse {

    private status: number;
    private data: object;
    private count: number;
    private averageEnergyConsumption: number

    constructor(status: number, data ?: object, count?: number, averageEnergyConsumption?: number){
        this.status = status;
        this.data = data;
        this.count = count;
        this.averageEnergyConsumption = averageEnergyConsumption;
    }
    
    public getData(){
        return this.data;
    }
    
    public getaverageEnergyConsumption() {
        return this.averageEnergyConsumption
    }

    public getStatusString() {
        return Status[this.status];
    }

    public getCount() {
        return this.count;
    }
    
}