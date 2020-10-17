import React, { ChangeEvent, FormEvent, useState } from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import { FiPlus } from "react-icons/fi";

import '../styles/pages/create-orphanage.css';
import Sidebar from "../components/Sidebar";
import mapIcon from "../util/mapIcon";
import { LeafletMouseEvent } from "leaflet";
import api from "../services/api";
import { useHistory } from "react-router-dom";


export default function CreateOrphanage() {
  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0
  })

  const [name, setName] = useState("")
  const [about, setAbout] = useState("")
  const [instructions, setInstructions] = useState("")
  const [opening_hours, setOpeningHours] = useState("")
  const [open_on_weekends, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])

  const history = useHistory();

  function handleMapClick(event: LeafletMouseEvent) {
    const { lat, lng } = event.latlng

    setPosition({
      latitude: lat,
      longitude: lng
    })
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const { latitude, longitude } = position

    const data = new FormData();

    data.append("name", name)
    data.append("about", about)
    data.append("latitude", String(latitude))
    data.append("longitude", String(longitude))
    data.append("instructions", instructions)
    data.append("opening_hours", opening_hours)
    data.append("open_on_weekends", String(open_on_weekends))

    images.forEach(img => data.append("images", img));

    await api.post("/orphanages", data)

    alert("Cadastro realizado com sucesso!");
    history.push("/app")
  }

  function handleSelectImages(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const selectedImages = Array.from(e.target.files);
    setImages(img => ([...img, ...selectedImages]));

    const selectedImagesPreview = selectedImages.map(img => URL.createObjectURL(img))
    setPreviewImages(before => ([...before, ...selectedImagesPreview]));
  }

  return (
    <div id="page-create-orphanage">
      <Sidebar />

      <main>
        <form className="create-orphanage-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[-20.3876286,-43.505222]} 
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onclick={handleMapClick}
            >
              <TileLayer 
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />

              {
                position.latitude !== 0 && position.longitude !== 0 &&
                  <Marker 
                    interactive={false} 
                    icon={mapIcon} 
                    position={[
                      position.latitude,
                      position.longitude
                    ]} 
                  />
              }
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input value={name} onChange={e => setName(e.target.value)} id="name" />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea value={about} onChange={e => setAbout(e.target.value)} id="about" maxLength={300} />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {previewImages.map(image => (
                  <img src={image} alt={name} key={image} />
                ))}
                <label className="new-image" htmlFor="image[]">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>

              <input multiple onChange={handleSelectImages} type="file" id="image[]" />
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea value={instructions} onChange={e => setInstructions(e.target.value)} id="instructions" />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de funcionamento</label>
              <input value={opening_hours} onChange={e => setOpeningHours(e.target.value)} id="opening_hours" />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button 
                  onClick={() => setOpenOnWeekends(true)} 
                  className={open_on_weekends ? "active" : ""}
                  type="button"
                >Sim</button>
                <button 
                  onClick={() => setOpenOnWeekends(false)} 
                  className={!open_on_weekends ? "active" : ""}
                  type="button"
                >Não</button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
