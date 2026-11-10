import { useNavigate, useSearchParams } from 'react-router'
import { Box, Button } from '@mui/material'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import EncabezadoPagina, { EncabezadoSeccion, NotaDatosEjemplo } from '@/componentes/EncabezadoPagina'
import Panel from '@/componentes/Panel'
import { Seleccion } from '@/componentes/formulario/Campos'
import { Barras, Columnas, TarjetaGrafico } from '@/componentes/graficos/Graficos'
import { serie, serieMeses } from '@/componentes/graficos/series'
import { api, useApi } from '@/mocks'
import { fuentes } from '@/tema/tokens'
import { fechaCorta } from '@/utiles/formato'

const ciudades = { Ushuaia: 'Ushuaia', 'Río Grande': 'Río Grande', Tolhuin: 'Tolhuin' }

function Indicador({ cifra, texto, detalle }) {
  return (
    <Panel sx={{ p: '14px 16px' }}>
      <Box sx={{ fontFamily: fuentes.titulos, fontSize: 30, fontWeight: 600, lineHeight: 1 }}>{cifra}</Box>
      <Box sx={{ fontWeight: 600, fontSize: 14, mt: '6px' }}>{texto}</Box>
      <Box sx={{ fontSize: 12.5, color: 'text.tertiary' }}>{detalle}</Box>
    </Panel>
  )
}

function Seccion({ titulo, bajada, children }) {
  return (
    <Box component="section" sx={{ mb: 4 }}>
      <EncabezadoSeccion titulo={titulo} bajada={bajada} />
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' } }}>{children}</Box>
    </Box>
  )
}

// Una tarjeta con su tabla de datos; `tipo` columnas o barras.
function Grafico({ datos, tipo = 'barras', conPorcentaje, ...props }) {
  return (
    <TarjetaGrafico datos={datos} conPorcentaje={conPorcentaje} {...props}>
      {tipo === 'columnas' ? <Columnas datos={datos} /> : <Barras datos={datos} conPorcentaje={conPorcentaje} />}
    </TarjetaGrafico>
  )
}

// Estadísticas (estadisticas.md): indicadores sobre los casos vigentes. Las cifras las calcula la API.
// Con los datos de ejemplo, los filtros se aplican a la URL pero las cifras no cambian (no hay API).
export default function Estadisticas() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const { datos: e } = useApi(() => api.estadisticas())
  const filtros = { anio: params.get('anio') ?? String(e.anio), ciudad: params.get('ciudad'), organismo: params.get('organismo') }
  const organismos = api.nombresOrganismos()
  const pie = `casos vigentes en ${filtros.anio}`
  const pieAnimales = `animales de los casos vigentes en ${filtros.anio}`
  const pieTratamiento = 'casos vigentes con tratamiento cargado'
  const total = e.totalVigentes
  const { indicadores: i } = e

  function poner(campo, valor) {
    const siguiente = new URLSearchParams(params)
    if (valor) siguiente.set(campo, valor)
    else siguiente.delete(campo)
    setParams(siguiente)
  }

  function exportar() {
    const p = new URLSearchParams()
    p.set('desde', `${filtros.anio}-01-01`)
    p.set('hasta', `${filtros.anio}-12-31`)
    if (filtros.ciudad) p.set('ciudad', filtros.ciudad)
    if (filtros.organismo) p.set('organismo', filtros.organismo)
    navigate(`/consultas/exportar?${p}`)
  }

  const destacadaHoraria = [...e.franjaHoraria].sort((a, b) => b.casos - a.casos)[0].valor

  return (
    <>
      <EncabezadoPagina titulo="Estadísticas" bajada={`Indicadores sobre los casos vigentes. Datos al ${fechaCorta(e.datosAl)}.`} extra={<NotaDatosEjemplo />} />

      <Panel sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, flexWrap: 'wrap', p: '14px 16px 0', mb: 3 }}>
        <Seleccion etiqueta="Período" vacio={null} opciones={[['2026', '2026'], ['2025', '2025']]} valor={filtros.anio} onCambio={(v) => poner('anio', v)} sx={{ width: 140 }} />
        <Seleccion etiqueta="Ciudad" vacio="Todas" opciones={ciudades} valor={filtros.ciudad} onCambio={(v) => poner('ciudad', v)} sx={{ width: 180 }} />
        <Seleccion etiqueta="Organismo" vacio="Todos" opciones={organismos.map((o) => [o, o])} valor={filtros.organismo} onCambio={(v) => poner('organismo', v)} sx={{ width: 240 }} />
        <Button variant="outlined" color="inherit" startIcon={<FileDownloadOutlinedIcon />} onClick={exportar} sx={{ ml: { md: 'auto' }, mb: '20px', borderColor: 'divider' }}>Exportar estos datos</Button>
      </Panel>

      {total === 0 ? (
        <Box sx={{ py: 6, textAlign: 'center', color: 'text.tertiary' }}>No hay casos vigentes con estos filtros.</Box>
      ) : (
        <>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, mb: 4 }}>
            <Indicador cifra={total} texto={`casos vigentes en ${filtros.anio}`} detalle="No cuenta desestimados ni unificados: un unificado ya está contado en el caso que lo absorbió." />
            <Indicador cifra={i.victimas0a9} texto="víctimas de 0 a 9 años" detalle={`${Math.round((i.victimas0a9 / total) * 100)} % de los casos, en el grupo de edad más chico`} />
            <Indicador cifra={i.viaPublica} texto="en la vía pública" detalle={`${Math.round((i.viaPublica / total) * 100)} % de los casos`} />
            <Indicador
              cifra={i.animalesVacunaDesconocida.noSabe + i.animalesVacunaDesconocida.sinDato}
              texto="animales sin saber si estaban vacunados"
              detalle={`${Math.round(((i.animalesVacunaDesconocida.noSabe + i.animalesVacunaDesconocida.sinDato) / i.totalAnimales) * 100)} % de los animales: ${i.animalesVacunaDesconocida.noSabe} «no sabe» y ${i.animalesVacunaDesconocida.sinDato} «sin dato»`}
            />
          </Box>

          <Seccion titulo="Cuándo" bajada="Fecha, día y hora del hecho">
            <Grafico titulo="Casos por mes" area="Cuándo" mide="fecha del hecho" tipo="columnas" pie={pie} datos={serieMeses(e.casosPorMes, e.datosAl)} />
            <Grafico titulo="Día de la semana" area="Cuándo" mide="día del hecho" tipo="columnas" pie={pie} datos={serie(e.diaSemana, null, { destacados: ['Sáb', 'Dom'] })} />
            <Grafico titulo="Franja horaria" area="Cuándo" mide="hora del hecho" tipo="columnas" pie={pie} datos={serie(e.franjaHoraria, null, { destacados: [destacadaHoraria] })} />
          </Seccion>

          <Seccion titulo="Quién" bajada="La persona atacada">
            <Grafico titulo="Franja etaria de la víctima" area="Quién" mide="edad al momento del ataque" tipo="columnas" pie={pie} datos={serie(e.franjaEtaria, null, { destacados: ['0–9'] })} />
          </Seccion>

          <Seccion titulo="Dónde" bajada="Ciudad y tipo de lugar">
            <Grafico titulo="Ciudad" area="Dónde" mide="ciudad del hecho" pie={pie} nota="El detalle por barrio y por calle va en el mapa." datos={serie(e.ciudad)} />
            <Grafico titulo="Tipo de lugar" area="Dónde" mide="dónde ocurrió" pie={pie} datos={serie(e.tipoDeLugar, 'tipoLugar')} />
          </Seccion>

          <Seccion titulo="Animal" bajada="El animal que atacó">
            <Grafico titulo="Especie" area="Animal" mide="especie" pie={pieAnimales} datos={serie(e.especie, 'especie')} />
            <Grafico titulo="Tamaño" area="Animal" mide="tamaño" pie={pieAnimales} datos={serie(e.tamano, 'tamano')} />
            <Grafico titulo="Tenencia del animal" area="Animal" mide="de quién es" pie={pieAnimales} datos={serie(e.tenencia, 'tenencia')} />
            <Grafico titulo="Vacunación del animal" area="Animal" mide="vacuna antirrábica" pie={pieAnimales} datos={serie(e.vacunacion, 'vacunacion')} />
          </Seccion>

          <Seccion titulo="Lesión" bajada="Zona del cuerpo y gravedad, del tratamiento">
            <Grafico titulo="Zona del cuerpo lesionada" area="Lesión" mide="lesión principal" pie={pieTratamiento} nota="Sale del tratamiento que carga Salud: los casos que no pasaron por Salud no tienen este dato." datos={serie(e.zonaDelCuerpo.valores, 'zona', { destacados: ['cabeza'] })} />
            <Grafico titulo="Gravedad de la lesión" area="Lesión" mide="gravedad" pie={pieTratamiento} datos={serie(e.gravedad.valores, 'gravedad')} />
          </Seccion>

          <Seccion titulo="Registro" bajada="No son datos epidemiológicos">
            <Grafico titulo="Origen del registro" area="Registro" mide="organismo que lo registró" pie={pie} conPorcentaje datos={serie(e.origenRegistro, null, { total })} />
            <Grafico titulo="Datos sin completar" area="Registro" mide="casos sin ese dato" pie={pie} conPorcentaje nota="Solo cuenta «sin dato»: la pregunta no se hizo o no se respondió. «No sabe» es una respuesta y no entra acá." datos={serie(e.sinCompletar, null, { total })} />
          </Seccion>
        </>
      )}
    </>
  )
}
