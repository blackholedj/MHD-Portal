import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import { FaFilePdf, FaFileUpload, FaDownload, FaTrash } from "react-icons/fa";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .order("name");
    if (error) console.error("Error fetching documents:", error);
    else setDocuments(data);
    setLoading(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const fileName = `${Date.now()}_${file.name}`;

    // 1. Nahrání souboru do Storage
    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(fileName, file);
    if (uploadError) {
      console.error("Upload error:", uploadError);
      setUploading(false);
      return;
    }

    // 2. Uložení odkazu do databáze
    const { error: dbError } = await supabase
      .from("documents")
      .insert({ name: file.name, file_path: fileName });
    if (dbError) console.error("Database insert error:", dbError);
    else {
      fetchDocuments(); // Refresh seznamu
      setFile(null);
      e.target.reset(); // Vyčistí input
    }
    setUploading(false);
  };

  const handleDelete = async (doc) => {
    if (!window.confirm(`Opravdu chcete smazat soubor "${doc.name}"?`)) return;

    // 1. Smazání souboru ze Storage
    const { error: storageError } = await supabase.storage
      .from("documents")
      .remove([doc.file_path]);
    if (storageError) console.error("Storage delete error:", storageError);

    // 2. Smazání záznamu z databáze
    const { error: dbError } = await supabase
      .from("documents")
      .delete()
      .eq("id", doc.id);
    if (dbError) console.error("Database delete error:", dbError);
    else fetchDocuments();
  };

  const getPublicUrl = (filePath) => {
    const { data } = supabase.storage.from("documents").getPublicUrl(filePath);
    return data.publicUrl;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dokumenty</h1>

      {isAdmin && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaFileUpload /> Nahrát nový dokument
          </h2>
          <form onSubmit={handleUpload}>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
            <button
              type="submit"
              disabled={uploading}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {uploading ? "Nahrávám..." : "Nahrát"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p>Načítám dokumenty...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between"
            >
              <div className="flex items-center gap-4 truncate">
                <FaFilePdf className="text-red-500 flex-shrink-0" size={24} />
                <span className="font-medium truncate" title={doc.name}>
                  {doc.name}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={getPublicUrl(doc.file_path)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-blue-600"
                  title="Stáhnout"
                >
                  <FaDownload />
                </a>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(doc)}
                    className="p-2 text-gray-600 hover:text-red-600"
                    title="Smazat"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Documents;
