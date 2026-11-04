import { useState } from 'react'
import { Link } from 'react-router'
import { Box, IconButton, Menu, MenuItem } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Dato, { Datos } from '@/componentes/Dato'
import { Rotulo } from '@/componentes/Bloque'
import { ArchivoAdjunto } from '@/componentes/ChipDato'
import { dia10, edadesAparentes, especies, etiqueta, sexos, siNoNoSabe, tamanos, tenencias } from '@/componentes/caso/catalogos'
import { fuentes } from '@/tema/tokens'
import { chip, dni, fechaCorta, nombreCompleto, plural } from '@/utiles/formato'

// Un animal del caso: identidad, lo que se supo de él en este caso, seguimiento y fotos.
// Cada sección aparece solo si la API la manda (Salud, p. ej., no recibe la descripción).
export default function BloqueAnimal({ animal: a, onEditar }) {
  const [ancla, setAncla] = useState(null)
  const especie = especies[a.especie]
  const verChip = 'chip' in a
  const d = a.descripcion

  // «en N casos» es la única forma en que se ve que dos casos comparten un animal.
  const enCasos = a.enCasos > 1
    ? <Box component={Link} to={`/consultas/animales/${a.id}`} sx={{ color: 'primary.main', textDecoration: 'underline' }}>en {plural(a.enCasos, 'caso')}</Box>
    : <span>en 1 caso</span>

  return (
    <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: { xs: '12px 14px', sm: '14px 18px' } }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.25, flexWrap: 'wrap', pr: 5, position: 'relative' }}>
        <Box component="h3" sx={{ m: 0, fontFamily: fuentes.titulos, fontWeight: 600, fontSize: 15.5 }}>Animal {a.indice + 1} · {especie}</Box>
        <Box component="span" sx={{ fontFamily: fuentes.mono, fontSize: 12.5, color: 'text.tertiary' }}>
          {verChip && <>{a.chip ? `chip ${chip(a.chip)}` : 'sin chip'} · </>}
          {enCasos}
        </Box>
        {onEditar && (
          <>
            <IconButton aria-label={`Acciones del animal ${a.indice + 1}`} size="small" onClick={(e) => setAncla(e.currentTarget)} sx={{ position: 'absolute', right: -8, top: -4 }}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
            <Menu anchorEl={ancla} open={Boolean(ancla)} onClose={() => setAncla(null)}>
              <MenuItem onClick={() => { setAncla(null); onEditar() }}>Editar animal</MenuItem>
            </Menu>
          </>
        )}
      </Box>

      <Rotulo>Identidad y tenencia</Rotulo>
      <Datos>
        <Dato codigo="A1" etiqueta="Especie" valor={especie} />
        {verChip && <Dato etiqueta="Chip" valor={chip(a.chip)} mono />}
        {'tenencia' in a && <Dato codigo="A5" etiqueta="Tenencia" valor={etiqueta(tenencias, a.tenencia)} />}
        {'dueno' in a && <Dato etiqueta="Dueño durante el caso" valor={nombreCompleto(a.dueno)} nota={a.dueno ? `DNI ${dni(a.dueno.dni)}` : null} />}
        <Dato codigo="A7" etiqueta="Domicilio o zona del animal" valor={a.zona} />
        <Dato codigo="A8" etiqueta="Vacunado contra la rabia" valor={etiqueta(siNoNoSabe, a.vacunado)} />
      </Datos>

      {d && (
        <>
          <Rotulo>Descripción</Rotulo>
          <Datos>
            <Dato codigo="A2" etiqueta="Tamaño" valor={etiqueta(tamanos, d.tamano)} />
            <Dato codigo="A9" etiqueta="Sexo" valor={etiqueta(sexos, d.sexo)} />
            <Dato etiqueta="Edad aparente" valor={etiqueta(edadesAparentes, d.edadAparente)} />
            <Dato codigo="A13" etiqueta="Color" valor={d.color} />
            <Dato codigo="A4" etiqueta="Raza" valor={d.raza} />
            <Dato codigo="A11" etiqueta="¿Podría reconocerlo?" valor={etiqueta(siNoNoSabe, d.podriaReconocerlo)} />
          </Datos>
        </>
      )}

      {a.dia10 && (
        <>
          <Rotulo>Seguimiento · Zoonosis</Rotulo>
          <Datos>
            <Dato
              etiqueta="Observación del día 10"
              valor={dia10[a.dia10.valor]}
              nota={a.dia10.fecha ? `${fechaCorta(a.dia10.fecha)} · ${a.dia10.por}` : null}
            />
            <Dato etiqueta="Observaciones" valor={a.observaciones} ancho={2} />
          </Datos>
        </>
      )}

      {a.fotos && (
        <>
          <Rotulo>Fotos del animal</Rotulo>
          {a.fotos.length ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {a.fotos.map((f) => <ArchivoAdjunto key={f.nombre} imagen nombre={f.nombre} url={f.url} />)}
            </Box>
          ) : <Box sx={{ fontSize: 14, color: 'text.tertiary' }}>Sin fotos.</Box>}
        </>
      )}

      {a.declaradoEnSolicitud && (
        <>
          <Rotulo>Lo que declaró la persona sobre el animal</Rotulo>
          <Box sx={{ fontSize: 13.5, color: 'text.secondary' }}>
            Según la solicitud {a.declaradoEnSolicitud.solicitud}:
            {a.declaradoEnSolicitud.dueno && <> dueño “{a.declaradoEnSolicitud.dueno}”</>}
            {a.declaradoEnSolicitud.chip && <> · chip {chip(a.declaradoEnSolicitud.chip)}</>}.
            <Box component="span" sx={{ display: 'block', fontSize: 12, color: 'text.tertiary', mt: '2px' }}>
              Es una referencia: no se copia al dueño ni al chip. Zoonosis lo confirma con «Editar animal».
            </Box>
          </Box>
        </>
      )}
    </Box>
  )
}
