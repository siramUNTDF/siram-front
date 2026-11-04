import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { Box, Button, IconButton, Menu, MenuItem } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AddIcon from '@mui/icons-material/Add'
import HistoryIcon from '@mui/icons-material/History'
import EncabezadoPagina, { NotaDatosEjemplo } from '@/componentes/EncabezadoPagina'
import Panel from '@/componentes/Panel'
import Bloque from '@/componentes/Bloque'
import Mensaje from '@/componentes/Mensaje'
import Dato, { Datos } from '@/componentes/Dato'
import ChipDato, { ArchivoAdjunto } from '@/componentes/ChipDato'
import Mapa from '@/componentes/mapa/Mapa'
import EstadoCaso from '@/componentes/caso/EstadoCaso'
import MarcasCaso from '@/componentes/caso/MarcasCaso'
import { DetalleEstado } from '@/componentes/caso/TablaCasos'
import { canalesOrigen, estadosDenuncia, etiqueta, gravedades, motivosNoDenuncia, siNoNoSabe, tiposLugar, zonasCuerpo } from '@/componentes/caso/catalogos'
import { api, useApi } from '@/mocks'
import { fuentes } from '@/tema/tokens'
import { dni, fechaCorta, fechaHora, nombreCompleto } from '@/utiles/formato'
import NoEncontrada from '@/pantallas/NoEncontrada'
import BloqueAnimal from './BloqueAnimal'
import Ventanas from './Ventanas'

const siNo = (v) => (v == null ? null : v ? 'Sí' : 'No')

function SinCargar({ children }) {
  return <Box sx={{ fontSize: 14, color: 'text.tertiary' }}>{children ?? 'Todavía no se cargó.'}</Box>
}

function BotonCarga({ children, onClick }) {
  return <Button variant="outlined" color="inherit" startIcon={<AddIcon />} onClick={onClick} sx={{ borderColor: 'divider', alignSelf: 'flex-start' }}>{children}</Button>
}

// Ficha del caso (ficha-del-caso.md). Es solo lectura: cada cambio se hace en una ventana lateral.
// Lo que la API no manda (por permisos) no se muestra; los botones aparecen según `permisos`.
export default function FichaCaso() {
  const { numero } = useParams()
  const navigate = useNavigate()
  const { datos: caso, error } = useApi(() => api.obtenerCaso(numero), [numero])
  const [ventana, setVentana] = useState(null)
  const [anclaMenu, setAnclaMenu] = useState(null)

  if (error) return <NoEncontrada />

  const puede = (p) => caso.permisos.includes(p)
  const abrir = (tipo, datos = {}) => setVentana({ tipo, ...datos })
  const v = caso.victima
  const conDatosPersonales = 'nombre' in v
  const bajada = [caso.tipoEvento, caso.lugar.ciudad, fechaCorta(caso.fechaHecho)].filter(Boolean).join(' · ')

  return (
    <>
      <EncabezadoPagina
        volver="/casos"
        titulo={caso.numero}
        junto={<MarcasCaso marcas={caso.marcas} faltantes={caso.faltantes} />}
        bajada={bajada}
        extra={(
          <>
            <NotaDatosEjemplo />
            {puede('editar') && (
              <Button variant="outlined" color="inherit" startIcon={<EditOutlinedIcon />} onClick={() => abrir('editar')} sx={{ borderColor: 'divider', bgcolor: 'background.paper' }}>Editar</Button>
            )}
            {puede('cambiar_estado') && <Button variant="contained" onClick={() => abrir('estado')}>Cambiar estado</Button>}
            {(puede('cambiar_estado') || caso.historial) && (
              <>
                <IconButton aria-label="Más acciones" aria-haspopup="menu" onClick={(e) => setAnclaMenu(e.currentTarget)}>
                  <MoreVertIcon />
                </IconButton>
                <Menu anchorEl={anclaMenu} open={Boolean(anclaMenu)} onClose={() => setAnclaMenu(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
                  {puede('cambiar_estado') && caso.transiciones.includes('desestimado') && (
                    <MenuItem onClick={() => { setAnclaMenu(null); abrir('desestimar') }}>Desestimar caso</MenuItem>
                  )}
                  {caso.historial && <MenuItem onClick={() => navigate(`/casos/${caso.numero}/historial`)}>Ver historial</MenuItem>}
                </Menu>
              </>
            )}
          </>
        )}
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Panel sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', p: '12px 16px' }}>
          <Box>
            <EstadoCaso estado={caso.estado} />
            <DetalleEstado caso={caso} />
          </Box>
          <ChipDato>{caso.registro.organismo}</ChipDato>
          <Box component="span" sx={{ fontSize: 13, color: 'text.tertiary', pl: 1.5, borderLeft: { sm: 1 }, borderColor: { sm: 'divider' } }}>
            Registrado por <Box component="strong" sx={{ color: 'text.primary', fontWeight: 600 }}>{caso.registro.por}</Box>
            <Box component="span" sx={{ fontFamily: fuentes.mono, fontSize: 12.5 }}> · {fechaHora(caso.registro.fecha)} · canal de origen: {canalesOrigen[caso.canalOrigen]}</Box>
          </Box>
          {caso.estado === 'desestimado' && caso.observacionDesestimacion && (
            <Box sx={{ width: '100%', fontSize: 13, color: 'text.secondary' }}>Observación: {caso.observacionDesestimacion}</Box>
          )}
        </Panel>

        {caso.coincidencia && (
          <Mensaje
            tipo="duplicado"
            titulo="Posible duplicado"
            acciones={puede('resolver_duplicado') && (
              <>
                <Button variant="outlined" color="inherit" component={Link} to={`/casos/comparar/${caso.numero}/${caso.coincidencia.numero}`} sx={{ bgcolor: 'background.paper', color: 'dup.main', borderColor: 'dup.main' }}>Comparar casos</Button>
                <Button variant="text" color="inherit" onClick={() => abrir('distintos')} sx={{ color: 'text.primary' }}>No es duplicado</Button>
              </>
            )}
          >
            La víctima tiene el mismo DNI que en {caso.coincidencia.numero} ({caso.coincidencia.organismo}, registrado el {fechaHora(caso.coincidencia.registradoEl)}). Revisá los dos casos antes de seguir.
          </Mensaje>
        )}

        <Bloque titulo="Víctima">
          <Datos>
            {conDatosPersonales && <Dato codigo="P1" etiqueta="Nombre y apellido" valor={nombreCompleto(v)} />}
            <Dato codigo="P2" etiqueta="Edad" valor={v.edad != null ? `${v.edad} años` : null} />
            {conDatosPersonales && (
              <>
                <Dato codigo="P6" etiqueta="DNI" valor={dni(v.dni)} mono />
                <Dato codigo="P4" etiqueta="Teléfono" valor={v.telefono} mono />
                <Dato codigo="P3" etiqueta="Correo electrónico" valor={v.correo} />
                <Dato codigo="P7" etiqueta="Domicilio" valor={v.domicilio} />
              </>
            )}
          </Datos>
        </Bloque>

        {caso.contactoResponsable && (
          <Bloque titulo="Contacto responsable" bajada="Informó el hecho por la víctima. Opcional: no existe si la víctima se registró sola.">
            <Datos>
              <Dato etiqueta="Nombre y apellido" valor={nombreCompleto(caso.contactoResponsable)} />
              <Dato etiqueta="DNI" valor={dni(caso.contactoResponsable.dni)} mono />
              <Dato etiqueta="Teléfono" valor={caso.contactoResponsable.telefono} mono />
              <Dato etiqueta="Correo electrónico" valor={caso.contactoResponsable.correo} />
            </Datos>
          </Bloque>
        )}

        <Bloque titulo="Hecho">
          <Datos>
            <Dato codigo="H1" etiqueta="Fecha del hecho" valor={fechaCorta(caso.fechaHecho)} mono />
            <Dato codigo="H2" etiqueta="Hora" valor={caso.horaHecho} mono />
            <Dato codigo="H3" etiqueta="Ciudad" valor={caso.lugar.ciudad} />
            <Dato codigo="H4" etiqueta="Dirección" valor={caso.lugar.direccion} />
            <Dato etiqueta="Referencias" valor={caso.lugar.referencias} />
            <Dato codigo="H5" etiqueta="Tipo de lugar" valor={etiqueta(tiposLugar, caso.tipoLugar)} />
            <Dato codigo="T1" etiqueta="Tipo de evento" valor={caso.tipoEvento} ancho={3} />
          </Datos>
          <Box sx={{ mt: 2.5 }}>
            {caso.lugar.latitud != null ? (
              <>
                <Mapa alto={220} centro={[caso.lugar.latitud, caso.lugar.longitud]} puntos={[{ id: caso.numero, latitud: caso.lugar.latitud, longitud: caso.lugar.longitud, grave: caso.marcas.includes('grave') }]} />
                <Box sx={{ mt: '6px', fontFamily: fuentes.mono, fontSize: 12, color: 'text.tertiary' }}>Pin del hecho ({caso.lugar.latitud}; {caso.lugar.longitud})</Box>
              </>
            ) : (
              <Dato etiqueta="Ubicación en el mapa" valor={null} />
            )}
          </Box>
        </Bloque>

        <Bloque
          titulo={`Animales · ${caso.animales.length}`}
          bajada="Cada animal tiene su identidad (especie, chip) y lo que se supo de él en este caso. Dueño, chip, tenencia y seguimiento los carga solo Zoonosis."
          acciones={puede('agregar_animal') && <BotonCarga onClick={() => abrir('animal')}>Agregar animal</BotonCarga>}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {caso.animales.map((a) => (
              <BloqueAnimal key={a.indice} animal={a} onEditar={puede('editar_animal') ? () => abrir('animal', { indice: a.indice }) : null} />
            ))}
          </Box>
        </Bloque>

        {(caso.tratamiento !== undefined || caso.tratamientoExiste !== undefined) && (
          <Bloque
            titulo="Tratamiento · Salud"
            bajada={caso.tratamiento ? `Lo ve y lo carga solo Salud · ${caso.tratamiento.organismo}, ${caso.tratamiento.por} · ${fechaCorta(caso.tratamiento.cargadoEl)}` : undefined}
            acciones={puede('cargar_tratamiento') && <BotonCarga onClick={() => abrir('tratamiento')}>{caso.tratamiento ? 'Editar tratamiento' : 'Cargar tratamiento'}</BotonCarga>}
          >
            {caso.tratamiento ? (
              <Datos>
                <Dato etiqueta="Fecha de la consulta" valor={fechaCorta(caso.tratamiento.fechaConsulta)} mono />
                <Dato codigo="L3" etiqueta="Zona del cuerpo" valor={etiqueta(zonasCuerpo, caso.tratamiento.zonaCuerpo)} />
                <Dato codigo="L2" etiqueta="Gravedad" valor={etiqueta(gravedades, caso.tratamiento.gravedad)} />
                <Dato codigo="L7" etiqueta="Vacuna antirrábica" valor={siNo(caso.tratamiento.antirrabica)} />
                <Dato etiqueta="Antitetánica" valor={siNo(caso.tratamiento.antitetanica)} />
                <Dato codigo="L6" etiqueta="Antibiótico" valor={siNo(caso.tratamiento.antibiotico)} />
                <Dato codigo="L5" etiqueta="Sutura" valor={siNo(caso.tratamiento.sutura)} />
                <Dato etiqueta="Observaciones" valor={caso.tratamiento.observaciones} ancho={2} />
              </Datos>
            ) : caso.tratamientoExiste ? (
              <SinCargar>Recibió atención en Salud.</SinCargar>
            ) : (
              <SinCargar />
            )}
          </Bloque>
        )}

        {(caso.denuncias !== undefined || caso.denunciasCantidad !== undefined) && (
          <Bloque
            titulo="Denuncias · Zoonosis"
            bajada={caso.denuncias ? 'Solo las anota Zoonosis. Estado: pendiente de confirmación · confirmada · desestimada (tentativo).' : undefined}
            acciones={puede('anotar_denuncia') && <BotonCarga onClick={() => abrir('denuncia')}>Anotar denuncia</BotonCarga>}
          >
            {caso.denuncias ? (
              caso.denuncias.length ? (
                <>
                  <Box sx={{ fontSize: 12.5, color: 'text.tertiary', mb: 1 }}>Denuncias anotadas · {caso.denuncias.length}</Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {caso.denuncias.map((d) => (
                      <Denuncia key={d.id} denuncia={d} onCorregir={puede('corregir_denuncia') ? () => abrir('denuncia', { denuncia: d }) : null} />
                    ))}
                  </Box>
                </>
              ) : <SinCargar>Todavía no se anotó ninguna denuncia.</SinCargar>
            ) : (
              <SinCargar>
                {caso.denunciasCantidad
                  ? `Tiene ${caso.denunciasCantidad} ${caso.denunciasCantidad === 1 ? 'denuncia anotada' : 'denuncias anotadas'} en Zoonosis. El detalle (DNI de quien la hizo, número, observaciones) lo ve solo Zoonosis.`
                  : 'No tiene denuncias anotadas en Zoonosis.'}
              </SinCargar>
            )}
          </Bloque>
        )}

        <Bloque titulo="Lo que declaró la persona" bajada="Lo cargó la persona en el formulario público. Ningún agente lo edita; si hay varias solicitudes, gana la más reciente.">
          <Datos>
            <Dato codigo="D1" etiqueta="¿Hizo denuncia en Zoonosis?" valor={etiqueta(siNoNoSabe, caso.declarado.hizoDenuncia)} />
            <Dato
              codigo="D3"
              etiqueta="Motivo de no denunciar"
              valor={caso.declarado.hizoDenuncia === 'no' ? etiqueta(motivosNoDenuncia, caso.declarado.motivoNoDenuncia) : caso.declarado.hizoDenuncia ? '—' : null}
              nota="Solo si respondió No"
            />
            <Box>
              <Box sx={{ fontSize: 12, color: 'text.tertiary', mb: '3px' }}>Solicitudes</Box>
              {caso.declarado.solicitudes.length ? caso.declarado.solicitudes.map((s) => (
                <Box key={s.numero} sx={{ mb: 0.5 }}>
                  <Box component={Link} to={`/casos/solicitudes/${s.numero}`} sx={{ fontFamily: fuentes.mono, fontWeight: 600, color: 'primary.main', textDecoration: 'none' }}>{s.numero}</Box>
                  <Box sx={{ fontSize: 12, color: 'text.tertiary' }}>{s.sumadaEl ? `Sumada el ${fechaCorta(s.sumadaEl)}` : `Registrada el ${fechaCorta(s.registradaEl)}`}</Box>
                </Box>
              )) : <Box sx={{ fontSize: 14, color: 'text.tertiary' }}>Ninguna</Box>}
            </Box>
          </Datos>
        </Bloque>

        {caso.documentos && (
          <Bloque
            titulo="Documentos"
            bajada="Solo nombre del archivo y dónde está alojado. Las fotos del animal van en cada animal."
            acciones={puede('adjuntar_documento') && <BotonCarga onClick={() => abrir('documento')}>Adjuntar documento</BotonCarga>}
          >
            <Box sx={{ fontSize: 12, color: 'text.tertiary', mb: '6px' }}>
              <Box component="span" sx={{ fontFamily: fuentes.mono, fontSize: 10.5, mr: '6px' }}>X1</Box>Certificado médico
            </Box>
            {caso.documentos.length ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {caso.documentos.map((d) => <ArchivoAdjunto key={d.nombre} nombre={d.nombre} url={d.url} detalle={`Cargado por ${d.cargadoPor} · ${fechaCorta(d.fecha)}`} />)}
              </Box>
            ) : <SinCargar>Todavía no se adjuntó ningún documento.</SinCargar>}
          </Bloque>
        )}

        {caso.historial && (
          <Panel sx={{ p: '16px 20px' }}>
            <Box component="h2" sx={{ m: 0, fontFamily: fuentes.titulos, fontSize: 17, fontWeight: 600 }}>Historial</Box>
            <Box sx={{ fontSize: 13.5, color: 'text.tertiary', my: 1 }}>
              {caso.historial.cambios} cambios · el último, {fechaHora(caso.historial.ultimo.fecha)} por {caso.historial.ultimo.por}{caso.historial.ultimo.organismo ? ` (${caso.historial.ultimo.organismo})` : ''}
            </Box>
            <Button variant="outlined" color="inherit" startIcon={<HistoryIcon />} component={Link} to={`/casos/${caso.numero}/historial`} sx={{ borderColor: 'divider' }}>Ver historial</Button>
          </Panel>
        )}
      </Box>

      <Ventanas caso={caso} ventana={ventana} onCerrar={() => setVentana(null)} onCambiar={setVentana} />
    </>
  )
}

function Denuncia({ denuncia: d, onCorregir }) {
  const [ancla, setAncla] = useState(null)
  return (
    <Box sx={{ position: 'relative', p: '12px 14px', border: 1, borderColor: 'divider', borderRadius: 1, bgcolor: 'background.default', maxWidth: 560, fontSize: 13.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', pr: 4 }}>
        <Box component="strong">Denuncia</Box>
        <Box component="span" sx={{ fontFamily: fuentes.mono, color: 'text.secondary' }}>N.º {d.numero ?? 'sin número'} · {fechaCorta(d.fecha)}</Box>
        <Box component="span" sx={{ px: 1, py: '1px', borderRadius: 999, fontSize: 12, fontWeight: 600, bgcolor: d.estado === 'confirmada' ? 'success.soft' : d.estado === 'desestimada' ? 'error.soft' : 'warning.soft', color: d.estado === 'confirmada' ? 'success.main' : d.estado === 'desestimada' ? 'error.main' : 'warning.main' }}>
          {estadosDenuncia[d.estado]}
        </Box>
      </Box>
      <Box sx={{ mt: '4px' }}>DNI de quien la hizo: <Box component="span" sx={{ fontFamily: fuentes.mono }}>{dni(d.dniDenunciante)}</Box></Box>
      {d.observaciones && <Box sx={{ color: 'text.secondary' }}>Observaciones: {d.observaciones}</Box>}
      <Box sx={{ fontSize: 12, color: 'text.tertiary', mt: '2px' }}>Anotada por {d.anotadaPor} · {fechaHora(d.anotadaEn)}</Box>
      {onCorregir && (
        <>
          <IconButton aria-label={`Acciones de la denuncia ${d.numero ?? ''}`} size="small" onClick={(e) => setAncla(e.currentTarget)} sx={{ position: 'absolute', top: 8, right: 8 }}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
          <Menu anchorEl={ancla} open={Boolean(ancla)} onClose={() => setAncla(null)}>
            <MenuItem onClick={() => { setAncla(null); onCorregir() }}>Corregir</MenuItem>
          </Menu>
        </>
      )}
    </Box>
  )
}
