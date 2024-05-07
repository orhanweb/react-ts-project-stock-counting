export interface StructureToCount {
  id: number;
  depo: string;
}

export interface CountVariant {
  id: number;
  title: string;
}

export interface CountType {
  id: number;
  title: string;
}

export interface CountArea {
  id: number;
  title: string;
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
  title: string;
  fclass: number; // sayım türü (variant)
  ftype: number; // sayım tipi (type)
  lock_items: number; // false on first record
  user_id: number; // Set it to 0 statically and fix it when you add the session part.
  status: number; // set true at begining
  timeChanged: string; // now
  timeEntered: string; // now
  depo_id: number;
  site_id: number; // Sayım alanı id
  startDate: string; // date: format => 2024-02-15 17:19:06.000000
  endDate: string;
}

export interface CountInterface {
  sayim_id: number;
  sayim_adi: string;
  tur: string;
  tip: string;
  alan: string;
  baslangic: string;
  bitis: string;
  depo_name: string;
  durum: string; // can be 0, 1 or 2
  depo_id: number;
}

export interface AddProductToCount {
  sayim_id: number;
  depos_id: number;
  code: string; // ürün codu
  inv_id: number; // ürün idsi
  user_id: number;
  stockData: Record<string, string>;
}

export interface Person {
  person: { id: string; name: string };
}

export interface ViewCounted {
  sayim_adi: string;
  depos_adi: string;
  urun_cesidi: number;
  personel_sayisi: number;
  ilk_sayim_saati: string;
  son_sayim_saati: string;
  sayilan_urunler: ViewCountedProducts[];
}

export interface ViewCountedProducts {
  trans_id: number;
  urun_code: string;
  urun_adi: string;
  unit: string; // adet, paket, koli,
  quantity: string; // ürünün stok miktarı
  user_id: number;
  time: string;
  date: string;
}

export interface CountedExcel {
  urun: string;
  farkli_sayim_noktasi: number;
  toplam_miktar: string;
  ana_birim: string;
  birim_fiyat: string;
  tutar: string;
  date: string;
}
