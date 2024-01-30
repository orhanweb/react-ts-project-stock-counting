import React from "react";

// Örneğin, src/utils/renderCellContent.ts dosyasında
export const renderContent = (content: any) => 
    content === null || content === undefined ? null :
    React.isValidElement(content) ? content : 
    String(content);
