import "leaflet/dist/leaflet.css";

import { CircleMarker } from "react-leaflet/CircleMarker";
import { MapContainer } from "react-leaflet/MapContainer";
import { Popup } from "react-leaflet/Popup";
import { TileLayer } from "react-leaflet/TileLayer";
import type { Evidencia } from "../../../../types/evidencia";
import { CENTRO_BRASIL } from "./constantesMapaLeaflet";
import { montarMarcadoresBlockchain } from "./extratoresLocalizacaoMapa";
import { PopupRegistroBlockchain } from "./PopupRegistroBlockchain";

type MapaRegistrosBlockchainProps = {
  evidenciasOnChain: Evidencia[];
};

// Componente principal do mapa real.
// Ele não monta dados manualmente; apenas renderiza os marcadores já preparados.
export function MapaRegistrosBlockchain({
  evidenciasOnChain,
}: MapaRegistrosBlockchainProps) {
  const marcadores = montarMarcadoresBlockchain(evidenciasOnChain);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-blue-500">
          mapa on-chain
        </p>

        <h3 className="mt-1 font-display text-xl font-extrabold text-slate-950">
          Evidências registradas na blockchain
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          Cada ponto azul representa uma evidência registrada na blockchain.
          Clique no ponto para ver município, contrato e hashes.
        </p>

        <div className="mt-4 inline-flex rounded-2xl border border-blue-100 bg-blue-50 px-4 py-2">
          <span className="text-sm font-bold text-blue-950">
            {evidenciasOnChain.length} registro(s) on-chain
          </span>
        </div>
      </div>

      <div className="h-155 w-full">
        <MapContainer
          center={CENTRO_BRASIL}
          zoom={4}
          minZoom={3}
          maxZoom={12}
          scrollWheelZoom
          className="h-full w-full"
        >
          {/* Camada base gratuita do OpenStreetMap */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Cada evidência registrada on-chain vira um marcador clicável */}
          {marcadores.map((marcador, indice) => (
            <CircleMarker
              key={`${marcador.uf}-${marcador.municipio}-${indice}`}
              center={marcador.coordenada}
              radius={8}
              pathOptions={{
                color: "#1d4ed8",
                fillColor: "#2563eb",
                fillOpacity: 0.85,
                weight: 2,
              }}
            >
              <Popup>
                <PopupRegistroBlockchain marcador={marcador} />
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}