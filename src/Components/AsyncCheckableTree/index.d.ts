export interface TreeNode {
    id: string;
    label: string;
    children?: TreeNode[]; // Çocuk düğümler, eğer varsa
    isChecked?: boolean; // Düğümün işaretli olup olmadığı
    isOpen?: boolean; // Düğümün genişletilip genişletilmediği
    isLeaf?: boolean; // Düğümün yaprak (alt düğümü olmayan) olup olmadığı
    type?: 'mainStructure' | 'corridor' | 'section' | 'level'; // Düğüm türü
    isLoading?: boolean; // Düğümün çocuklarının yüklenip yüklenmediği
    hasError?: boolean; // Düğüm yüklenirken hata oluşup oluşmadığı
    canHaveChildren?: boolean; // Düğümün teorik olarak çocukları olup olmadığı (API'den dönen bilgiye göre)
    level?: number; // Düğümün derinlik seviyesi
    parent?: string; // Ebeveyn düğümün ID'si (düzleştirilmiş yapı için)
  }
  


  export interface AsyncCheckableTreeProps {
    data: TreeNode[]; // Başlangıç düğüm verileri
    onCheck?: (node: TreeNode) => void; // Düğüm kontrol edildiğinde tetiklenir
    onToggle?: (nodeId: string) => void; // Düğüm genişletildiğinde/daraltıldığında tetiklenir
    onLoadChildren?: (nodeId: string) => Promise<TreeNode[]>; // Çocuk düğümler yüklendiğinde tetiklenir
    onSelectNode?: (node: TreeNode) => void; // Bir düğüm seçildiğinde tetiklenir
    onError?: (error: Error) => void; // Hata durumunda tetiklenir
  }
  
