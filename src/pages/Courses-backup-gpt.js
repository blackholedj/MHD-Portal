import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaTimes,
  FaImage,
  FaSave,
} from "react-icons/fa";

// =================================================================================
// Komponenta pro zobrazení karty jednoho kurzu
// =================================================================================
const CourseCard = ({ course, onEdit, onDelete, isAdmin }) => {
  const getPhotoUrl = (path) => {
    if (!path)
      return "https://placehold.co/600x400/e2e8f0/64748b?text=Foto+chybí";
    const { data } = supabase.storage.from("courses").getPublicUrl(path);
    return data.publicUrl;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{course.name}</h3>
            <p className="text-sm text-gray-500 mb-3">{course.description}</p>
          </div>
          {isAdmin && (
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => onEdit(course)}
                className="bg-blue-100 p-2 rounded-full text-blue-600 hover:bg-blue-200"
                title="Upravit"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => onDelete(course)}
                className="bg-red-100 p-2 rounded-full text-red-600 hover:bg-red-200"
                title="Smazat"
              >
                <FaTrash />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="border-t md:border-t-0 md:border-r border-gray-200">
          <h4 className="font-semibold p-3 bg-gray-50 text-center text-sm text-gray-600">
            Ranní část
          </h4>
          <img
            src={getPhotoUrl(course.morning_photo_path)}
            alt={`Ranní část - ${course.name}`}
            className="w-full h-48 object-cover"
          />
        </div>
        <div>
          <h4 className="font-semibold p-3 bg-gray-50 text-center text-sm text-gray-600 border-t border-gray-200">
            Odpolední část
          </h4>
          <img
            src={getPhotoUrl(course.afternoon_photo_path)}
            alt={`Odpolední část - ${course.name}`}
            className="w-full h-48 object-cover"
          />
        </div>
      </div>
    </div>
  );
};

// =================================================================================
// Komponenta formuláře pro přidání/editaci kurzu (v modálním okně)
// =================================================================================
const CourseForm = ({ course, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: course?.name || "",
    description: course?.description || "",
    day_type: course?.day_type || "Pracovní dny",
  });
  const [morningFile, setMorningFile] = useState(null);
  const [afternoonFile, setAfternoonFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const dayTypes = ["Pracovní dny", "Sobota Neděle a svátky"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, fileType) => {
    if (e.target.files && e.target.files.length > 0) {
      if (fileType === "morning") setMorningFile(e.target.files[0]);
      if (fileType === "afternoon") setAfternoonFile(e.target.files[0]);
    }
  };

  const uploadPhoto = async (file, fileType) => {
    if (!file) return null;
    const filePath = `public/${Date.now()}-${fileType}-${file.name}`;
    const { error } = await supabase.storage
      .from("courses")
      .upload(filePath, file);
    if (error) {
      console.error(`Error uploading ${fileType} photo:`, error);
      return null;
    }
    return filePath;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const morningPath = await uploadPhoto(morningFile, "morning");
    const afternoonPath = await uploadPhoto(afternoonFile, "afternoon");

    let dataToSubmit = {
      ...formData,
    };

    if (course) {
      // Editace
      dataToSubmit.morning_photo_path =
        morningPath || course.morning_photo_path;
      dataToSubmit.afternoon_photo_path =
        afternoonPath || course.afternoon_photo_path;
      const { error } = await supabase
        .from("courses")
        .update(dataToSubmit)
        .eq("id", course.id);
      if (error) console.error("Error updating course:", error);
    } else {
      // Vytvoření
      dataToSubmit.morning_photo_path = morningPath;
      dataToSubmit.afternoon_photo_path = afternoonPath;
      const { error } = await supabase.from("courses").insert([dataToSubmit]);
      if (error) console.error("Error creating course:", error);
    }

    setUploading(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 transition-opacity">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {course ? "Upravit kurz" : "Přidat nový kurz"}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-800"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Název, Popis, Typ dne */}
          <input
            type="text"
            name="name"
            placeholder="Název linky/kurzu"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
            required
          />
          <textarea
            name="description"
            placeholder="Krátký popis"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-md"
            rows="3"
          ></textarea>
          <select
            name="day_type"
            value={formData.day_type}
            onChange={handleChange}
            className="w-full p-3 border rounded-md bg-white"
          >
            {dayTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Upload fotek */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaImage /> Ranní část
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "morning")}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaImage /> Odpolední část
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, "afternoon")}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          {/* Tlačítka */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Zrušit
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
            >
              <FaSave /> {uploading ? "Ukládám..." : "Uložit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// =================================================================================
// Hlavní komponenta stránky
// =================================================================================
const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [filter, setFilter] = useState("Pracovní dny");
  const { isAdmin } = useAuth();
  const dayTypes = ["Pracovní dny", "Sobota Neděle a svátky"];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("name");
    if (error) console.error("Error fetching courses:", error);
    else setCourses(data);
    setLoading(false);
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleDelete = async (course) => {
    if (!window.confirm(`Opravdu chcete smazat kurz "${course.name}"?`)) return;

    const pathsToRemove = [
      course.morning_photo_path,
      course.afternoon_photo_path,
    ].filter((p) => p);
    if (pathsToRemove.length > 0) {
      await supabase.storage.from("courses").remove(pathsToRemove);
    }
    await supabase.from("courses").delete().eq("id", course.id);
    fetchCourses();
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingCourse(null);
    fetchCourses();
  };

  const filteredCourses = courses.filter(
    (course) => course.day_type === filter
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Kurzy / Linky</h1>
        {isAdmin && (
          <button
            onClick={() => {
              setEditingCourse(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            <FaPlus /> Přidat kurz
          </button>
        )}
      </div>

      {/* Filtrovací tlačítka */}
      <div className="mb-8 flex flex-wrap gap-2">
        {dayTypes.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              filter === type
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {showForm && (
        <CourseForm
          course={editingCourse}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <p>Načítám kurzy...</p>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">
            Pro typ dne "<span className="font-semibold">{filter}</span>" nebyly
            nalezeny žádné kurzy.
          </p>
        </div>
      )}
    </div>
  );
};

export default Courses;
