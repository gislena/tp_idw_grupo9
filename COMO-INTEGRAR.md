# Parte compartida — Abigail

Este módulo reutilizable implementa la lógica común de las páginas de gestión: lectura y escritura en LocalStorage, generación automática del ID, listado, alta, edición, eliminación con confirmación y actualización del total. Cada integrante lo configura para su entidad y mantiene sus propios campos y contenido.

## Archivos

- `js/gestor-entidad.js`: módulo común que se importa desde el JavaScript de cada entidad.

## Qué tiene que tener cada página

1. Un formulario con un campo cuyo `name` coincida con cada propiedad de la entidad. No incluyas un campo para el ID: el módulo lo genera automáticamente.
2. Una tabla con encabezados para los campos y una última columna de acciones. Su `<tbody>` recibe las filas.
3. Un contador opcional para mostrar el total.
4. Un archivo JavaScript propio de la página, con `type="module"`, que configure el módulo común.
5. Bootstrap 5 cargado según la forma acordada por el grupo.

Ejemplo de esqueleto HTML (adaptar campos y encabezados a cada entidad):

```html
<form id="form-mascota">
  <div class="mb-3">
    <label for="nombreMascota" class="form-label">Nombre</label>
    <input id="nombreMascota" name="nombreMascota" class="form-control" required>
  </div>
  <button type="submit" class="btn btn-primary">Registrar</button>
  <button type="button" id="cancelar-edicion" class="btn btn-secondary" hidden>Cancelar edición</button>
</form>

<p>Total: <span id="total-mascotas">0</span></p>
<table class="table table-striped">
  <thead>
    <tr><th>Nombre</th><th>Acciones</th></tr>
  </thead>
  <tbody id="tabla-mascotas"></tbody>
</table>

<script type="module" src="./js/mascotas.js"></script>
```

## Ejemplo de configuración para Mascotas

Guardá esto en `js/mascotas.js`. Las propiedades de `fields` deben coincidir con los atributos `name` del HTML. Agregá al formulario los demás campos requeridos en el PDF: `nombreDuenio`, `color`, `edad` y `peso`; agregalos también a `columns`.

```js
import { crearGestorEntidad } from './gestor-entidad.js';

crearGestorEntidad({
  clave: 'mascotas',
  idField: 'idMascota',
  form: '#form-mascota',
  tbody: '#tabla-mascotas',
  count: '#total-mascotas',
  cancelSelector: '#cancelar-edicion',
  submitLabel: 'Registrar mascota',
  editLabel: 'Guardar cambios',
  fields: [
    { name: 'nombreMascota', label: 'Nombre', type: 'text', required: true },
    { name: 'nombreDuenio', label: 'Nombre del dueño', type: 'text', required: true },
    { name: 'color', label: 'Color', type: 'text', required: true },
    { name: 'edad', label: 'Edad', type: 'number', required: true, integer: true },
    { name: 'peso', label: 'Peso', type: 'number', required: true },
  ],
  columns: [
    { label: 'Nombre', value: (m) => m.nombreMascota },
    { label: 'Dueño', value: (m) => m.nombreDuenio },
    { label: 'Color', value: (m) => m.color },
    { label: 'Edad', value: (m) => m.edad },
    { label: 'Peso', value: (m) => `${m.peso} kg` },
  ],
  confirmDeleteMessage: '¿Querés eliminar esta mascota?',
});
```

## Ejemplo de configuración para Veterinarios

La persona responsable de Veterinarios puede usar el mismo módulo con sus propios campos. Para el valor de consulta, el módulo permite formatear la columna como moneda:

```js
import { crearGestorEntidad } from './gestor-entidad.js';

const moneda = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
});

crearGestorEntidad({
  clave: 'veterinarios',
  idField: 'idVeterinario',
  form: '#form-veterinario',
  tbody: '#tabla-veterinarios',
  count: '#total-veterinarios',
  cancelSelector: '#cancelar-edicion-veterinario',
  submitLabel: 'Registrar veterinario',
  editLabel: 'Guardar cambios',
  fields: [
    { name: 'matricula', label: 'Matrícula', type: 'number', required: true, integer: true },
    { name: 'nombre', label: 'Nombre', type: 'text', required: true },
    { name: 'especializacion', label: 'Especialización', type: 'text', required: true },
    { name: 'valorConsulta', label: 'Valor de consulta', type: 'number', required: true },
  ],
  columns: [
    { label: 'Matrícula', value: (v) => v.matricula },
    { label: 'Nombre', value: (v) => v.nombre },
    { label: 'Especialización', value: (v) => v.especializacion },
    { label: 'Valor de consulta', value: (v) => moneda.format(v.valorConsulta) },
  ],
  confirmDeleteMessage: '¿Querés eliminar este veterinario?',
});
```

## Antes de integrar

- Las claves `mascotas` y `veterinarios` son diferentes para que los datos no se mezclen. El grupo puede acordar otros nombres, pero cada entidad debe tener una clave propia.
- Los selectores configurados (`form`, `tbody`, `count` y `cancelSelector`) tienen que existir en el HTML correspondiente.
- Los campos numéricos deben tener `type="number"`; configurá `step="1"` para los enteros y `step="any"` para los decimales.
- Al terminar, prueben crear, editar, eliminar y recargar la página para confirmar que se conservan los datos.
- El PDF de esta entrega especifica ABM solo para Mascotas y Veterinarios. Para Turnos e Historia Clínica se necesita la consigna y los campos que defina el grupo.
