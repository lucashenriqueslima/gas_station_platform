import * as React from 'react'

export interface Point {
  lat: number
  lng: number
  useDefaultIcon?: boolean
  title?: string
  color?: string
}

export interface MapProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Lista de pontos onde serão adicionados os marcadores.
   */
  points: Point[]
  /**
   * Zoom do mapa. Padrão: 12.
   */
  zoom?: number
  /**
   * Ponto central do mapa. Caso não seja informado, o mapa será centralizado no primeiro ponto,
   * ou ajustará o zoom automaticamente para englobar todos os pontos (fitBounds).
   */
  center?: Point
  /**
   * Chave de API do Google Maps. Opcional se estiver configurada a variável
   * VITE_GOOGLE_MAPS_API_KEY no .env
   */
  apiKey?: string
}

export function Map({ points, zoom = 12, center, apiKey, className, ...props }: MapProps) {
  const mapRef = React.useRef<HTMLDivElement>(null)
  const [map, setMap] = React.useState<any>(null)
  const markersRef = React.useRef<any[]>([])
  const polylineRef = React.useRef<any>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [distance, setDistance] = React.useState<number | null>(null)

  // Gerencia o carregamento do script do Google Maps
  React.useEffect(() => {
    const w = window as any
    if (w.google?.maps) {
      initMap()
      return
    }

    const key = apiKey || (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || ''

    const scriptId = 'google-maps-script'
    if (document.getElementById(scriptId)) {
      const interval = setInterval(() => {
        if (w.google?.maps) {
          initMap()
          clearInterval(interval)
        }
      }, 100)
      return () => clearInterval(interval)
    }

    const script = document.createElement('script')
    script.id = scriptId
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places,geometry`
    script.async = true
    script.defer = true
    script.onload = initMap
    script.onerror = () =>
      setError('Erro ao carregar o script do Google Maps. Verifique sua chave de API ou conexão.')
    document.head.appendChild(script)

    function initMap() {
      if (!mapRef.current) return

      const ww = window as any
      const initialCenter =
        center || (points.length > 0 ? points[0] : { lat: -15.7801, lng: -47.9292 }) // Default para Brasília

      const newMap = new ww.google.maps.Map(mapRef.current, {
        center: initialCenter,
        zoom: zoom,
        disableDefaultUI: false, // Controle de zoom e visualização do mapa ativados por padrão
      })

      setMap(newMap)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey])

  // Atualiza os marcadores e ajustar o centro/zoom do mapa
  React.useEffect(() => {
    const w = window as any
    if (!map || !w.google?.maps) return

    // Limpar os marcadores antigos
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    // Limpar polyline antigo
    if (polylineRef.current) {
      polylineRef.current.setMap(null)
    }

    // Adicionar os novos marcadores
    const newMarkers = points.map((point, index) => {
      const marker = new w.google.maps.Marker({
        position: { lat: point.lat, lng: point.lng },
        icon: point.useDefaultIcon
          ? null
          : {
              path: w.google.maps.SymbolPath.CIRCLE,
              fillColor: point.color || '#ef4444',
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#ffffff',
              scale: 10,
            },
        label: {
          text: String(index + 1),
          color: point.useDefaultIcon ? '#000000' : '#ffffff',
          fontSize: '11px',
          fontWeight: 'bold',
        },
        map: map,
        title: point.title || `Ponto ${index + 1}`,
        animation: w.google.maps.Animation.DROP,
      })

      let infoContent = `<div style="padding: 4px 8px; font-weight: 600; color: #1f2937; white-space: nowrap;">${point.title || `Ponto ${index + 1}`}</div>`

      if (index > 0 && w.google.maps.geometry) {
        const prev = points[index - 1]
        const dist = w.google.maps.geometry.spherical.computeDistanceBetween(
          new w.google.maps.LatLng(prev.lat, prev.lng),
          new w.google.maps.LatLng(point.lat, point.lng)
        )
        const distStr = dist > 1000 ? (dist / 1000).toFixed(2) + ' km' : Math.round(dist) + ' m'
        infoContent += `<div style="padding: 0 8px 4px; font-size: 13px; color: #6b7280; white-space: nowrap;">Do ponto anterior: <span style="font-weight:600; color:#3b82f6">${distStr}</span></div>`
      }

      const infoWindow = new w.google.maps.InfoWindow({
        content: infoContent,
      })
      marker.addListener('click', () => {
        infoWindow.open(map, marker)
      })

      return marker
    })

    markersRef.current = newMarkers

    // Desenhar linha entre os pontos se houver mais de um
    if (points.length > 1) {
      const path = points.map((p) => ({ lat: p.lat, lng: p.lng }))

      const polyline = new w.google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: '#3b82f6', // Cor azul
        strokeOpacity: 0.8,
        strokeWeight: 4,
        icons: [
          {
            icon: { path: w.google.maps.SymbolPath.FORWARD_CLOSED_ARROW },
            offset: '50px',
            repeat: '100px',
          },
        ],
        map: map,
      })
      polylineRef.current = polyline

      if (w.google.maps.geometry) {
        let totalMeters = 0
        for (let i = 0; i < path.length - 1; i++) {
          totalMeters += w.google.maps.geometry.spherical.computeDistanceBetween(
            new w.google.maps.LatLng(path[i].lat, path[i].lng),
            new w.google.maps.LatLng(path[i + 1].lat, path[i + 1].lng)
          )
        }
        setDistance(totalMeters)
      }
    } else {
      setDistance(null)
    }

    // Lógica para auto-centralizar usando bounds quando houver múltiplos pontos e o usuário não passou um centro específico
    if (points.length > 1 && !center) {
      const bounds = new w.google.maps.LatLngBounds()
      points.forEach((p) => bounds.extend({ lat: p.lat, lng: p.lng }))
      map.fitBounds(bounds)
    } else if (points.length === 1 && !center) {
      map.setCenter({ lat: points[0].lat, lng: points[0].lng })
    }
  }, [points, map, center])

  // Escutar a mudança explícita de zoom se o mapa já estiver criado
  React.useEffect(() => {
    if (map && zoom) {
      map.setZoom(zoom)
    }
  }, [map, zoom])

  // Limpeza dos marcadores e linha ao desmontar o componente
  React.useEffect(() => {
    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null))
      if (polylineRef.current) {
        polylineRef.current.setMap(null)
      }
    }
  }, [])

  if (error) {
    return (
      <div
        className={`flex items-center justify-center p-6 bg-red-50 text-red-500 rounded-lg min-h-[400px] border border-red-200 text-center ${className || ''}`}
      >
        <p className="max-w-md">{error}</p>
      </div>
    )
  }

  return (
    <div
      className={`relative w-full min-h-[400px] bg-zinc-100 rounded-lg shadow-sm border border-zinc-200 overflow-hidden ${className || ''}`}
      style={{ minHeight: '400px' }} // Garantir altura caso o tailwind não injete imediatamente
      {...props}
    >
      <div ref={mapRef} className="absolute inset-0 w-full h-full" />

      {distance !== null && distance > 0 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-5 py-2.5 rounded-full shadow-lg text-sm font-bold text-zinc-800 z-1 border border-zinc-200 flex items-center gap-2">
          <span>Distância:</span>
          <span className="text-blue-600">
            {distance > 1000 ? (distance / 1000).toFixed(2) + ' km' : Math.round(distance) + ' m'}
          </span>
        </div>
      )}
    </div>
  )
}

export default Map
