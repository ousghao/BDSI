import { useEffect, useRef } from 'react';

interface GoogleMapProps {
  lat?: number;
  lng?: number;
  zoom?: number;
  className?: string;
  title?: string;
}
 
export const GoogleMap: React.FC<GoogleMapProps> = ({
  lat = 34.03518273576291,
  lng = -4.976621301708027,
  zoom = 15,
  className = "w-full h-full",
  title = "Faculté des Sciences Dhar El Mehraz"
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    const initializeMap = () => {
      if (!mapRef.current || !(window as any).google) return;

      // Configuration de la carte
      const mapOptions = {
        center: { lat, lng },
        zoom,
        mapTypeId: (window as any).google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        navigationControl: true,
        scrollwheel: true,
        zoomControl: true,
        fullscreenControl: true,
        streetViewControl: true,
        styles: [
          {
            featureType: "poi",
            elementType: "geometry",
            stylers: [{ color: "#eeeeee" }]
          },
          {
            featureType: "poi",
            elementType: "labels.text",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9ca5b3" }]
          }
        ]
      };

      // Créer la carte
      const map = new (window as any).google.maps.Map(mapRef.current, mapOptions);
      mapInstanceRef.current = map;

      // Ajouter un marqueur
      const marker = new (window as any).google.maps.Marker({
        position: { lat, lng },
        map,
        title,
        icon: {
          path: (window as any).google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#3b82f6',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3
        }
      });

      // Fenêtre d'information
      const infoWindow = new (window as any).google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
              ${title}
            </h3>
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px; line-height: 1.4;">
              22MF+X9G, Fès<br />
              Route d'Imouzzer, BP 1796<br />
              30000 Fès, Maroc
            </p>
            <div style="margin-top: 10px;">
              <a 
                href="https://maps.google.com/?q=${lat},${lng}" 
                target="_blank" 
                style="color: #3b82f6; text-decoration: none; font-size: 14px; font-weight: 500;"
                rel="noopener noreferrer"
              >
                Ouvrir dans Google Maps
              </a>
            </div>
          </div>
        `
      });

      // Ouvrir la fenêtre d'information au clic sur le marqueur
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      // Ouvrir la fenêtre d'information par défaut
      infoWindow.open(map, marker);
    };

    // Charger Google Maps API si pas déjà chargée
    if (!(window as any).google) {
      const script = document.createElement('script');
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      script.onerror = () => {
        console.warn('Google Maps failed to load. Showing fallback.');
      };
      document.head.appendChild(script);
    } else {
      initializeMap();
    }
  }, [lat, lng, zoom, title]);

  // Fallback si Google Maps ne peut pas être chargé
  if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    return (
      <div className={className} style={{ minHeight: '400px' }}>
        <iframe
          src={`https://maps.google.com/maps?q=${lat},${lng}&hl=fr&z=${zoom}&output=embed`}
          width="100%"
          height="100%"
          style={{ border: 0, minHeight: '400px' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={title}
        />
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className={className}
      style={{ minHeight: '400px' }}
    />
  );
};
