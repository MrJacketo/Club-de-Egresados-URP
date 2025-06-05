import React from "react";
import { useParams } from "react-router-dom";
import PostulantesDeOferta from "../../components/OfertaLaboral/Postulantes";

export default function PostulantesOferta({ }) {
  const { id } = useParams();
  return (
    //body principal
    <div className="mt-4 mb-21">
      <h1 className="text-3xl font-bold text-center mb-6">
        Postulantes 
      </h1>
      <main className="bg-white w-[80%] m-auto mt-10 px-16 py-10 rounded-3xl">
        <PostulantesDeOferta idOferta={id} />
      </main>
    </div>
  );
}
