import React from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, content: string) => void;
  mode: "view" | "edit" | "create";
  document: { title: string; content: string } | null;
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  mode,
  document,
}) => {
  const [title, setTitle] = React.useState(document ? document.title : "");
  const [content, setContent] = React.useState(
    document ? document.content : ""
  );

  React.useEffect(() => {
    if (document) {
      setTitle(document.title);
      setContent(document.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [document]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "edit" && document) {
      onSubmit(document.id, title, content);
    } else {
      onSubmit(title, content);
    }
    setTitle("");
    setContent("");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md overflow-hidden">
        {mode === "view" ? (
          <>
            <h2 className="text-lg font-bold mb-4">{title}</h2>
            <p className="whitespace-pre-wrap break-words">{content}</p>
            <button
              onClick={onClose}
              className="mt-4 bg-red-300 text-white px-4 py-2 rounded hover:bg-red-400"
            >
              Fermer
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 className="text-lg font-bold mb-4">
              {mode === "create"
                ? "Ajouter un Document"
                : "Modifier le Document"}
            </h2>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre"
              required
              className="border border-gray-300 rounded p-2 w-full mb-4"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Contenu"
              required
              className="border border-gray-300 rounded p-2 w-full mb-4"
            ></textarea>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="bg-red-300 text-white px-4 py-2 rounded hover:bg-red-400"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600"
              >
                {mode === "create" ? "Ajouter" : "Modifier"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Modal;
