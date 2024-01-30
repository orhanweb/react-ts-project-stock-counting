export interface AccordionCardProps {
    title: React.ReactNode;
    isOpen: boolean;
    onClick: () => void; // Başlık tıklandığında tetiklenecek fonksiyon
    children: React.ReactNode;
}