declare namespace google {
  namespace maps {
    class Map {
      constructor(element: HTMLElement, options?: MapOptions);
      setCenter(latlng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      fitBounds(bounds: LatLngBounds): void;
      panTo(latlng: LatLng | LatLngLiteral): void;
      addListener(event: string, handler: Function): void;
    }

    class Marker {
      constructor(options?: MarkerOptions);
      setMap(map: Map | null): void;
      getPosition(): LatLng | null;
      addListener(event: string, handler: Function): void;
    }

    class InfoWindow {
      constructor(options?: InfoWindowOptions);
      open(map: Map, marker?: Marker): void;
      close(): void;
      setContent(content: string | HTMLElement): void;
    }

    interface MapMouseEvent {
      stop(): void;
    }

    class LatLngBounds {
      extend(latlng: LatLng | LatLngLiteral): void;
    }

    class LatLng {
      constructor(lat: number, lng: number);
    }

    enum SymbolPath {
      CIRCLE,
      BACKWARD_CLOSED_ARROW,
      BACKWARD_OPEN_ARROW,
      FORWARD_CLOSED_ARROW,
      FORWARD_OPEN_ARROW,
    }

    interface MapOptions {
      zoom?: number;
      center?: LatLng | LatLngLiteral;
      mapTypeControl?: boolean;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
    }

    interface MarkerOptions {
      position?: LatLng | LatLngLiteral;
      map?: Map | null;
      title?: string;
      icon?: string | Icon | Symbol;
    }

    interface InfoWindowOptions {
      content?: string | HTMLElement;
      disableAutoPan?: boolean;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    interface Icon {
      path?: string | SymbolPath;
      scale?: number;
      fillColor?: string;
      fillOpacity?: number;
      strokeColor?: string;
      strokeWeight?: number;
    }

    interface Symbol {
      path: SymbolPath;
      scale?: number;
      fillColor?: string;
      fillOpacity?: number;
      strokeColor?: string;
      strokeWeight?: number;
    }

    namespace event {
      function addListener(
        instance: InfoWindow | Map | Marker,
        eventName: string,
        handler: Function
      ): void;
    }
  }
}

