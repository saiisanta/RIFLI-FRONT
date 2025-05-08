import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Libros = () => {
  const [libros, setLibros] = useState([]);

  useEffect(() => {
    // Hacemos la petición al backend para obtener los libros
    axios.get('http://localhost:3000/api/books')  // Asegúrate de que esta URL coincida con tu backend
      .then(res => {
        setLibros(res.data);  // Guardamos los libros en el estado
      })
      .catch(err => {
        console.error('Error al obtener los libros:', err);
      });
  }, []);

  return (
    <div>
      <h2>Lista de Libros</h2>
      <ul>
        {libros.map(libro => (
          <li key={libro.id}>
            {libro.title} - {libro.author} ({libro.available ? "Disponible" : "No disponible"})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Libros;