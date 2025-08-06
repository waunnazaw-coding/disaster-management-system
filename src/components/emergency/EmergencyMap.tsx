import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { MapPin, Phone } from 'lucide-react';

// Create custom icons
const hospitalIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/580/580165.png',
  iconSize: [25, 25],
});

const emergencyIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/484/484167.png',
  iconSize: [25, 25],
});

const defaultIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/447/447031.png',
  iconSize: [25, 25],
});

const Map = ({ contacts, selectedContact }: any) => {
  const map = useMap();

  useEffect(() => {
    if (selectedContact) {
      map.flyTo([selectedContact.lat, selectedContact.lng], 15);
    } else if (contacts.length > 0) {
      // Fit map to show all markers
      const bounds = L.latLngBounds(
        contacts.map((contact: any) => [contact.lat, contact.lng])
      );
      map.fitBounds(bounds);
    } else {
      // Default view of Myanmar
      map.setView([21.9162, 95.9560], 6);
    }
  }, [contacts, selectedContact, map]);

  return null;
};

const EmergencyMap = ({ contacts, selectedContact }: any) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'hospital': return hospitalIcon;
      case 'emergency': return emergencyIcon;
      default: return defaultIcon;
    }
  };

  return (
    <MapContainer
      center={[21.9162, 95.9560]} // Myanmar coordinates
      zoom={6}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {contacts.map((contact: any) => (
        <Marker
          key={contact.id}
          position={[contact.lat, contact.lng]}
          icon={getIcon(contact.type)}
        >
          <Popup>
            <div className="space-y-1">
              <h3 className="font-medium">{contact.name}</h3>
              <p className="text-sm">{contact.address}</p>
              <p className="text-sm">{contact.region} Region</p>
              <a 
                href={`tel:${contact.phone}`} 
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
              >
                <Phone className="h-4 w-4" />
                {contact.phone}
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
      
      <Map contacts={contacts} selectedContact={selectedContact} />
    </MapContainer>
  );
};

export default EmergencyMap;