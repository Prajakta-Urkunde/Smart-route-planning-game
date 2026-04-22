import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const positions = [
  [18.5204, 73.8567], // Pune
  [18.5314, 73.8446],
  [18.5091, 73.8321],
  [18.5170, 73.8700],
  [18.5300, 73.8600]
];

function MapView({ path }) {

  const route = path.map(i => positions[i]);

  return (
    <MapContainer center={positions[0]} zoom={13} style={{height:"400px"}}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {positions.map((pos, i) => (
        <Marker key={i} position={pos} />
      ))}

      {route.length > 1 && (
        <Polyline positions={route} color="red" />
      )}
    </MapContainer>
  );
}

export default MapView;