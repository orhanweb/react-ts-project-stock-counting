import { CountInterface, ViewCounted } from "../../../../Redux/Models/apiTypes";

export interface CountDetailsCardProps {
  countDetails?: CountInterface;
  countedProducts?: ViewCounted;
  isCardOpen: boolean;
  toggleCardOpen: () => void;
}
