"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./components/Modal";

type DocumentType = {
  id: string;
  title: string;
  content: string;
};

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(
    null
  );
  const [mode, setMode] = useState<"view" | "edit" | "create">("create");

  const fetchDocuments = async () => {
    try {
      const response = await axios.get("/api/documents");
      setDocuments(response.data);
    } catch (err) {
      setError("Erreur lors du chargement des documents.");
    }
  };

  const createDocument = async (title: string, content: string) => {
    try {
      const response = await axios.post("/api/documents", { title, content });
      setDocuments([...documents, { id: response.data.id, title, content }]);
    } catch (err) {
      setError("Erreur lors de la création du document.");
    }
  };

  const updateDocument = async (id: string, title: string, content: string) => {
    try {
      await axios.put(`/api/documents/${id}`, { title, content });
      setDocuments(
        documents.map((doc) =>
          doc.id === id ? { ...doc, title, content } : doc
        )
      );
    } catch (err) {
      setError("Erreur lors de la mise à jour du document.");
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      await axios.delete(`/api/documents/${id}`);
      setDocuments(documents.filter((doc) => doc.id !== id));
    } catch (err) {
      setError("Erreur lors de la suppression du document.");
    }
  };

  const openDocumentDetails = (doc: DocumentType) => {
    setSelectedDocument(doc);
    setMode("view");
    setIsModalOpen(true);
  };

  const openDocumentEdit = (doc: DocumentType) => {
    setSelectedDocument(doc);
    setMode("edit");
    setIsModalOpen(true);
  };

  const openDocumentCreate = () => {
    setSelectedDocument(null);
    setMode("create");
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const MAX_CONTENT_LENGTH = 100;

  return (
    <div className="p-4 bg-sand-100">
      <h1 className="text-2xl font-bold mb-4">Documents</h1>

      {error && <p className="text-red-500">{error}</p>}

      <button
        onClick={openDocumentCreate}
        className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 mb-4"
      >
        Ajouter un document
      </button>

      <ul className="mt-4">
        {documents.map((doc) => (
          <li
            key={doc.id}
            className="border-b border-gray-300 py-2 cursor-pointer"
          >
            <div className="flex justify-between space-x-6">
              <div className="flex flex-col w-full">
                <button
                  onClick={() => openDocumentDetails(doc)}
                  className="flex flex-col w-full text-left p-2 hover:bg-gray-100 hover:rounded-2xl"
                >
                  <h2 className="font-semibold">{doc.title}</h2>
                  <p className="text-gray-600">
                    {doc.content.length > MAX_CONTENT_LENGTH
                      ? `${doc.content.substring(0, MAX_CONTENT_LENGTH)}...`
                      : doc.content}
                  </p>
                </button>
              </div>
              <div className="flex flex-col items-end space-y-3">
                <button
                  onClick={() => openDocumentEdit(doc)}
                  className="text-blue-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.5em"
                    height="1.5em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="m14.06 9.02l.92.92L5.92 19H5v-.92zM17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83l3.75 3.75l1.83-1.83a.996.996 0 0 0 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29m-3.6 3.19L3 17.25V21h3.75L17.81 9.94z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => deleteDocument(doc.id)}
                  className="text-red-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.5em"
                    height="1.5em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={mode === "edit" ? updateDocument : createDocument}
          mode={mode}
          document={selectedDocument}
        />
      )}
    </div>
  );
};

export default DocumentsPage;
