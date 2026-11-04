import { canalesOrigen, especies, gravedades, siNoNoSabe, tamanos, tenencias, tiposLugar, zonasCuerpo } from '@/componentes/caso/catalogos'
import { mesesCortos } from '@/utiles/formato'

// Convierte las series que manda la API ({ valor, casos }) en lo que dibujan los gráficos.
// «Sin dato» es su propia barra (punteada) y nunca se junta con «No sabe» (RN-23).
const catalogos = { tipoLugar: tiposLugar, tenencia: tenencias, zona: zonasCuerpo, gravedad: gravedades, canal: canalesOrigen, especie: especies, tamano: tamanos, vacunacion: siNoNoSabe }

export function serie(valores, catalogo, { destacados = [], total } = {}) {
  const cat = catalogos[catalogo] ?? {}
  return valores.map((v) => ({
    etiqueta: v.valor === 'sin_dato' ? 'Sin dato' : cat[v.valor] ?? v.valor,
    valor: v.casos,
    sinDato: v.valor === 'sin_dato',
    destacado: destacados.includes(v.valor),
    porcentaje: total ? Math.round((v.casos / total) * 100) : undefined,
  }))
}

export function serieMeses(casosPorMes, datosAl) {
  return casosPorMes.map((m) => ({
    etiqueta: mesesCortos[Number(m.mes.split('-')[1]) - 1],
    valor: m.casos,
    parcial: m.parcial,
    proyectado: m.proyectado,
    notaParcial: m.parcial ? `parcial · al ${datosAl.split('-').reverse().slice(0, 2).join('/')}` : null,
  }))
}
