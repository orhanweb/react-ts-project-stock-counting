// CountTypeSelector/index.d.ts

// CountType enum tanımı
export enum CountType {
    Depo = "depo",
    Market = "market",
    Vehicle = "vehicle"
}

// CountTypeSelectorProps interface tanımı
export interface CountTypeSelectorProps {
    countType: CountType;
    setCountType: (type: CountType) => void;
}
  