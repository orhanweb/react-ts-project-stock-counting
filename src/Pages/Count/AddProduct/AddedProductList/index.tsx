import { useState } from "react";
import Subtitle from "../../../../Components/Labels/Subtitle";
import { FiChevronRight } from "react-icons/fi";
import AccordionCard from "../../../../Components/AccordionCard";

export interface AddedProduct {
  barcode: string;
  name: string;
  stockData: Record<string, string>;
}

interface ProductListProps {
  addedProducts: AddedProduct[];
}

const AddedProductList: React.FC<ProductListProps> = ({ addedProducts }) => {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(
    null
  );

  const toggleShowAllProducts = () => {
    setShowAllProducts(!showAllProducts);
  };

  const handleAccordionClick = (index: number) => {
    setOpenAccordionIndex(openAccordionIndex === index ? null : index);
  };

  return (
    <div className="mt-4 flex flex-col gap-2">
      <Subtitle text="Son Eklenen Ürünler" />
      {showAllProducts && addedProducts.length > 1 && (
        <button
          onClick={toggleShowAllProducts}
          className="text-start text-text-darkest/50 dark:text-text-lightest/50"
        >
          <div className="flex items-center">
            <FiChevronRight />
            <span>Sadece Son Eklenen Ürünü Göster</span>
          </div>
        </button>
      )}
      <ul className="space-y-4">
        {(showAllProducts ? addedProducts : [addedProducts[0]]).map(
          (product, index) => (
            <AccordionCard
              key={index}
              title={product.name}
              isOpen={openAccordionIndex === index || 0 === index}
              onClick={() => handleAccordionClick(index)}
            >
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <span className="opacity-75">Barkod: </span>
                  {product.barcode}
                </li>
                {Object.keys(product.stockData).length > 0 && (
                  <li>
                    <span className="opacity-75">Stok Bilgileri: </span>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      {Object.entries(product.stockData).map(
                        ([unit, quantity], idx) => (
                          <li key={idx}>
                            <span className="opacity-75">{unit}: </span>
                            {quantity}
                          </li>
                        )
                      )}
                    </ul>
                  </li>
                )}
              </ul>
            </AccordionCard>
          )
        )}
      </ul>
      {!showAllProducts && addedProducts.length > 1 && (
        <button
          onClick={toggleShowAllProducts}
          className="text-start text-text-darkest/50 dark:text-text-lightest/50"
        >
          <div className="flex items-center">
            <FiChevronRight />
            <span>Tümünü Göster</span>
          </div>
        </button>
      )}
    </div>
  );
};

export default AddedProductList;
