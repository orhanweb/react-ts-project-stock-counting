export interface Market {
    amount: string;
    city_id: number;
    code: string;
    company_id: number;
    country_id: number;
    excode1: string;
    excode2: string;
    excode3: string;
    fclass: number;
    ftype: number;
    groupcode: string;
    id: number;
    lock_items: string;
    name: string;
    note: string;
    siteid: string;
    state_id: number;
    status: string;
    timechanged: string;
    timeentered: string;
    title: string;
    user_id: number;
}
  
export interface Corridor {
    id: number;
    depos_id: number;
    code: string;
    name: string;
    title: string;
    fclass: number;
    ftype: number;
    amount: string;
    lock_items: string;
    user_id: number;
    status: string;
    siteid: string;
    groupcode: string;
    excode1: string;
    excode2: string;
    excode3: string;
    note: string;
    timechanged: string;
    timeentered: string;
}
  
export interface SectionAndLevel {
    id: number;
    zones_id: number;
    floor: string;
    code: string;
    name: string;
    title: string;
    fclass: number;
    ftype: number;
    amount: string;
    lock_items: string;
    user_id: number;
    status: string;
    siteid: string;
    groupcode: string;
    excode1: string;
    excode2: string;
    excode3: string;
    note: string;
    timechanged: string;
    timeentered: string;
}

export interface Product {
    id: number;
    code: string;
    name: string;
    barcode1: string;
    barcode2: string;
    barcode3: string;
    unit: string;
    unitmult: string | number;
    unit2: string;
    unit2mult: string | number;
    unit3: string;
    unit3mult: string | number;
}

export interface CountFormData {
    id: string;
    countName: string;
    startDate: Date;
    endDate: Date;
    countType: string;
    selectedStructureId: number;
}  