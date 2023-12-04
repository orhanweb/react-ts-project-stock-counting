import React, { useState } from 'react';
import { TreeNode, AsyncCheckableTreeProps } from './index.d';
import { IoChevronForwardOutline,IoChevronDown  } from "react-icons/io5";

const AsyncCheckableTree: React.FC<AsyncCheckableTreeProps> = ({ data, onCheck }) => {
    // Durumları ve mantıkları burada oluşturun
    const [checkedNodes, setCheckedNodes] = useState<{ [key: string]: boolean }>({});
    const [expandedNodes, setExpandedNodes] = useState<{ [key: string]: boolean }>({});

    const updateParentCheckStatus = (nodeId: string, checkedNodes: { [key: string]: boolean }, nodes: TreeNode[]) => {
        const findParentNode = (id: string, nodeList: TreeNode[]): TreeNode | null => {
            for (let node of nodeList) {
                if (node.children && node.children.some(child => child.id === id)) {
                    return node;
                } else if (node.children) {
                    const found = findParentNode(id, node.children);
                    if (found) return found;
                }
            }
            return null;
        };
    
        const checkParent = (id: string) => {
            const parentNode = findParentNode(id, nodes);
            if (!parentNode) return;
    
            const isEveryChildChecked = parentNode.children?.every(child => checkedNodes[child.id]) ?? false;
            const isSomeChildChecked = parentNode.children?.some(child => checkedNodes[child.id]) ?? false;
    
            checkedNodes[parentNode.id] = isEveryChildChecked;
    
            if (!isEveryChildChecked && isSomeChildChecked) {
                // Eğer tüm çocuklar seçili değilse ama bazıları seçiliyse, 
                // burada ebeveynin durumunu daha fazla güncelleyebilirsiniz.
            }
    
            checkParent(parentNode.id); // Yukarıya doğru recursive kontrol
        };
    
        checkParent(nodeId);
    };
    
    const handleCheck = (node: TreeNode, isChecked: boolean) => {
        setCheckedNodes(prev => {
            const newCheckedNodes: { [key: string]: boolean } = { ...prev };

            const checkNodeAndChildren = (node: TreeNode, isChecked: boolean) => {
                newCheckedNodes[node.id] = isChecked;
                node.children?.forEach(childNode => {
                    checkNodeAndChildren(childNode, isChecked);
                });
            };
            checkNodeAndChildren(node, isChecked);

            updateParentCheckStatus(node.id, newCheckedNodes, data);

            return newCheckedNodes;
        });

        if (onCheck) {
            onCheck(node);
        }
    };

    

    // Düğüm genişletme/kapama işlevi
    const handleToggle = (nodeId: string) => {
        setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
    }


    const renderTreeNodes = (nodes: TreeNode[]) => {
        return nodes.map(node => (
            <div key={node.id}> {/* Her node arasında boşluk (10px) */}
                <div className="flex items-center mb-2"> {/* Flexbox ile hizalama */}
                    {/* Buton ya da yer tutucuyu koşullu olarak render et */}
                    {node.children && node.children.length > 0 ? (
                        <button
                            onClick={() => handleToggle(node.id)}
                            className="mr-1 opacity-70 cursor-pointer hover:opacity-100"
                        >
                        {expandedNodes[node.id] ? <IoChevronDown /> : <IoChevronForwardOutline />}
                        </button>
                    ) : (
                        <span className="mr-1 opacity-0">
                        <IoChevronForwardOutline />
                        </span>
                    )}
                    <label htmlFor={`checkbox-${node.id}`} className="flex items-center cursor-pointer">
                        <input
                            id={`checkbox-${node.id}`} // Unique id attribute
                            type="checkbox"
                            checked={checkedNodes[node.id] || false}
                            onChange={() => handleCheck(node, !checkedNodes[node.id])}
                            className="form-checkbox h-5 w-5 mr-2 text-primary hover:border-primary bg-background-lighter border-background rounded focus:outline-none focus:ring-0 focus:ring-offset-0 dark:bg-background-darker transition-colors duration-300 ease-in-out checked:bg-primary dark:checked:bg-primary cursor-pointer"
                        />
                        <span>{node.label}</span>
                    </label>
                </div>
                {expandedNodes[node.id] && node.children && (
                    <div className="ml-6"> {/* Alt node'lar için sol boşluk (20px) */}
                        {renderTreeNodes(node.children)}
                    </div>
                )}
            </div>
        ));
    };
    
    
    return (
        <div className="async-checkable-tree">
            {renderTreeNodes(data)}
        </div>
    );
    
};

export default AsyncCheckableTree;
