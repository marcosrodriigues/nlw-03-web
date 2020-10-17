import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiArrowRight } from 'react-icons/fi'
import { Map, Marker, TileLayer, Popup } from 'react-leaflet';

import mapMarker from '../images/map-marker.svg';

import '../styles/pages/orphanage-map.css'
import 'leaflet/dist/leaflet.css'
import mapIcon from '../util/mapIcon';
import api from '../services/api';

const MAP_BOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
const TILE_LAYER_URL = `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${MAP_BOX_TOKEN}`;

interface Orphanage {
    id: number,
    latitude: number,
    longitude: number,
    name: string,
}

function OrphanagesMap() {
    const [orphanages, setOrphanages] = useState<Orphanage[]>([])

    useEffect(() => {
        api.get("/orphanages").then(response => {
            const orphanages = response.data;
            setOrphanages(orphanages);
        })
    }, [])

    return (
        <div id="page-map">
            <aside>
                <header>
                    <img src={mapMarker} alt="Happy" />

                    <h2>Escolha um orfanato no mapa</h2>
                    <p>{`Muitas crianças estão esperando a sua visita :)`}</p>
                </header>

                <footer>
                    <strong>Ouro Preto</strong>
                    <span>Minas Gerais</span>
                </footer>
            </aside>

            <Map
                center={[-20.3914238,-43.5126098]}
                zoom={15}
                style={{ width: '100%', height: '100%' }}
            >
                <TileLayer url={TILE_LAYER_URL} />

                {
                    orphanages.length > 0 &&
                        orphanages.map(orphanage => (
                            <Marker key={orphanage.id} position={[orphanage.latitude, orphanage.longitude]} icon={mapIcon}>
                                <Popup closeButton={false} minWidth={240} maxWidth={240} className="map-popup">
                                    {orphanage.name}
                                    <Link to={`/orphanages/${orphanage.id}`}>
                                        <FiArrowRight size={20} color={"#fff"} />
                                    </Link>
                                </Popup>
                            </Marker>
                        ))
                }
                
                
            </Map>

            <Link to="/orphanages/create" className="create-orphanage">
                <FiPlus size={32} color="#FFF" />
            </Link>
        </div>
    )
}

export default OrphanagesMap;