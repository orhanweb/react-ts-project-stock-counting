import React from "react";

// src/Utils/renderContent.ts
export const renderContent = (content: any) =>
  content === null || content === undefined
    ? null
    : React.isValidElement(content)
    ? content
    : String(content);
