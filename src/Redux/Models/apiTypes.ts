export interface StructureToCount {
   id:number;
   depo:string;
}

export interface CountVariant {
    id:number;
    title:string;
}

export interface CountType {
    id:number;
    title:string;
}
  
export interface CountArea {
    id:number;
    title:string;
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
    name: string;
    title:string;
    fclass: number; // sayım türü (variant)
    ftype:number; // sayım tipi (type)
    lock_items:number; // ilk kayıtta false
    user_id:number; // statik olarak 0 ayarla session kısmını ekleyince düzelt
    status: number; // başlanıçta true ayarla
    timeChanged: string; // now
    timeEntered: string; // now
    depo_id: number;
    site_id: number; // Sayım alanı id 
    startDate: string; // date: formatı => 2024-02-15 17:19:06.000000
    endDate: string;
}  

export interface CountList{
    sayim_id: number;
    sayim_adi:string; 
    tur: string; // tür
    tip: string; // tip
    alan: string;
    baslangic: string;
    bitis: string;
    depo_name: string;
    durum: string; // 0, 1 veya 2 olabilir
}