export interface AccordionCardProps {
  title?: React.ReactNode;
  isOpen: boolean;
  onClick: () => void; // Function to be triggered when the title is clicked
  children: React.ReactNode;
}
