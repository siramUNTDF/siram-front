// Configuración que viene del entorno (.env). Nada de esto va escrito en las pantallas.
export const config = {
  mapaTeselas: import.meta.env.VITE_MAPA_TESELAS,
  mapaAtribucion: '© colaboradores de <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}
