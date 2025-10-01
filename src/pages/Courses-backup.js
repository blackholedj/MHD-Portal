import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import { FaPlus, FaTrash, FaEdit, FaTimes } from "react-icons/fa";

const CourseCard = ({ course, onEdit, onDelete, isAdmin }) => {
  const getPhotoUrl = (path) => {
    if (!path) return "https://placehold.co/600x400?text=Foto+chybí";
    const { data } = supabase.storage.from("courses").getPublicUrl(path);
    return data.publicUrl;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden relative">
      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={() => onEdit(course)}
            className="bg-white/80 p-2 rounded-full text-blue-600 hover:bg-blue-100"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete(course)}
            className="bg-white/80 p-2 rounded-full text-red-600 hover:bg-red-100"
          >
            <FaTrash />
          </button>
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{course.name}</h3>
        <p className="text-gray-600 mb-4">{course.description}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <div>
          <h4 className="font-semibold p-3 bg-gray-50 text-center">
            Ranní část
          </h4>
          <img
            src={getPhotoUrl(course.morning_photo_path)}
            alt={`Ranní část - ${course.name}`}
            className="w-full h-48 object-cover"
          />
        </div>
        <div>
          <h4 className="font-semibold p-3 bg-gray-50 text-center">
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

const CourseForm = ({ course, onSave, onCancel }) => {
  // Formulář pro přidání/editaci kurzu
  // ... Pro zjednodušení je tato část vynechána, ale fungovala by na stejném principu jako upload v Documents.js
  // Měla by inputy pro název, popis a 2x file input pro fotky.
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">
          {course ? "Upravit kurz" : "Přidat nový kurz"}
        </h2>
        <p>Tato funkce pro přidání/úpravu kurzů je ve vývoji.</p>
        <button
          onClick={onCancel}
          className="mt-4 px-4 py-2 bg-gray-300 rounded-md"
        >
          Zavřít
        </button>
      </div>
    </div>
  );
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const { isAdmin } = useAuth();

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

    // Smazání fotek ze Storage
    const pathsToRemove = [
      course.morning_photo_path,
      course.afternoon_photo_path,
    ].filter((p) => p);
    if (pathsToRemove.length > 0) {
      await supabase.storage.from("courses").remove(pathsToRemove);
    }

    // Smazání kurzu z databáze
    await supabase.from("courses").delete().eq("id", course.id);
    fetchCourses();
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingCourse(null);
    fetchCourses();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Kurzy / Linky</h1>
        {isAdmin && (
          <button
            onClick={() => {
              setEditingCourse(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FaPlus /> Přidat kurz
          </button>
        )}
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
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
