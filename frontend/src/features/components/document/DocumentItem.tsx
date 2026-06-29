import React from "react";
import type { IDocument } from "../../../core/interfaces/document.interfaces";

interface DocumentItemProps {
  doc: IDocument;
  removeDocument: (id:number) => void;
}

const DocumentItem: React.FC<DocumentItemProps> = ({ doc, removeDocument }) => {
  return (
    <>
      <li key={doc.id} className="border rounded-md p-3 flex items-center justify-between">
        <div>
          <p className="font-medium">{doc.name}</p>
          <p className="text-sm text-gray-500">{doc.type} {doc.description && `· ${doc.description}`}</p>
        </div>
        <button type="button" onClick={() => removeDocument(doc.id)}
          className="text-red-600 hover:text-red-800 text-sm"
        >
          წაშლა
        </button>
      </li>
    </>
  );
};

export default DocumentItem