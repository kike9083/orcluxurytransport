# Entrega del proyecto — Sitio web OrcLuxuryTransport

**Sitio:** https://orcluxurytransport.com
**Fecha de este documento:** 7 de septiembre de 2026

---

## PARTE 1 — Respuestas a las preguntas del propietario

### 1. ¿Con quién se compró el dominio y dónde se paga la renovación?

El dominio `orcluxurytransport.com` está registrado en **Cloudflare Registrar**, dentro de **su propia cuenta de Cloudflare** (la asociada a `orielca507@gmail.com`).

| Dato | Valor |
|---|---|
| Registrador | Cloudflare, Inc. |
| Fecha de registro | 31 de julio de 2026 |
| **Vence** | **31 de julio de 2027** |
| Costo de renovación | ~US$10.44 al año, al precio de costo |

**Dónde se paga:** entrando a `dash.cloudflare.com` con su correo, sección **Domain Registration → Manage Domains**. Ahí se ve la fecha de vencimiento y el medio de pago.

Una recomendación concreta: **active la renovación automática** (*Auto-renew*) en esa misma pantalla y confirme que la tarjeta registrada esté vigente. Si el dominio vence, el sitio y cualquier correo del dominio dejan de funcionar, y recuperarlo después puede ser costoso o imposible.

El dominio **ya está a su nombre y en su cuenta**. No hay nada que transferir.

---

### 2. ¿Dónde está alojado el sitio y cuál es la clave para hacer cambios?

**Alojamiento:** Cloudflare Pages, proyecto `orcluxurytransport`, en **la misma cuenta de Cloudflare suya**. Costo: **US$0 al mes**. No hay factura de hosting.

**Sobre la clave:** la cuenta de Cloudflare se creó con su correo `orielca507@gmail.com`. La contraseña se la entrego por separado, y le pido que haga dos cosas al recibirla:

1. **Cambie la contraseña** desde `dash.cloudflare.com`, en *My Profile → Authentication*. Así queda solo en su poder.
2. **Active la verificación en dos pasos** (2FA) en esa misma pantalla. Esa cuenta controla el dominio y el sitio: quien entre ahí se queda con los dos.

**Una aclaración importante, para evitar un malentendido:** este sitio **no se edita desde un panel** como WordPress o Wix. Es un sitio hecho a medida, en código. Entrar a Cloudflare le da control del dominio, del alojamiento y de las opiniones, pero **no una pantalla para cambiar textos o fotos**.

Para cambios de contenido hay tres caminos:

- **Fotos:** reemplazar el archivo en la carpeta `fotos/` conservando el mismo nombre, y volver a publicar. Requiere alguien con conocimientos técnicos.
- **Textos:** editar el archivo `index.html`. Igual.
- **Aprobar o borrar opiniones:** ver la Parte 3 de este documento.

Si prefiere poder editar usted mismo sin depender de nadie, eso es un trabajo aparte (migrar a un gestor de contenidos). Dígamelo y lo cotizo.

---

### 3. ¿El código está en un repositorio o lo tengo yo?

Está en **las dos partes**, y conviene ordenarlo:

- **Repositorio:** `https://github.com/dobled09/orcluxurytransport` — repositorio público de GitHub, hoy bajo **mi cuenta personal**, no la suya.
- **Copia local:** en mi computadora.
- **Copia publicada:** el código que está sirviendo Cloudflare, en su cuenta.

**Lo que propongo**, para que quede todo bajo su control:

| Opción | Qué implica |
|---|---|
| **A. Transferir el repositorio** (recomendada) | Usted crea una cuenta gratis en github.com y yo le transfiero el repositorio. Queda con todo el historial de cambios y usted como dueño. |
| **B. Entrega en archivo** | Le entrego un ZIP con todo el código y borro el repositorio de mi cuenta. Más simple, pero pierde el historial. |

En cualquiera de las dos, **le entrego igualmente el ZIP** como respaldo.

---

## PARTE 2 — Lista de traspaso

### Lo que ya está en su poder

- [x] **Dominio** `orcluxurytransport.com` — en su cuenta de Cloudflare
- [x] **Alojamiento** — proyecto `orcluxurytransport` en Cloudflare Pages, su cuenta
- [x] **Base de datos de opiniones** — `resenas-orcluxury` (Cloudflare D1), su cuenta
- [x] **Sitio en línea y funcionando** — con certificado de seguridad automático

### Lo que hay que traspasar

- [ ] **Contraseña de la cuenta de Cloudflare** — se entrega aparte, nunca por el mismo canal que este documento
- [ ] **Cambio de contraseña por parte del propietario**
- [ ] **Activar 2FA** en la cuenta de Cloudflare
- [ ] **Activar renovación automática** del dominio
- [ ] **Código:** transferir el repositorio de GitHub o entregar el ZIP
- [ ] **Archivos originales:** las 21 fotografías en su resolución completa

### Seguridad — pendiente y con prioridad

- [ ] **Revocar el token de API de Cloudflare** generado durante el desarrollo: `dash.cloudflare.com/profile/api-tokens` → **Delete**
- [ ] **Revocar las claves de R2**: panel de Cloudflare → **R2** → *Manage R2 API Tokens* → revocar

Esas credenciales se compartieron por chat durante el desarrollo. No se usaron para nada fuera de este proyecto, pero deben revocarse igual: son llaves de la cuenta que circularon por un canal que no es seguro. Revocarlas no afecta al sitio.

---

## PARTE 3 — Manual de operación

### Aprobar o borrar una opinión

Las opiniones que dejan los visitantes **no se publican solas**. Entran a la base de datos marcadas como no aprobadas y solo aparecen en la web cuando se aprueban. Una opinión ofensiva o spam se queda guardada y nunca llega al sitio.

Ver las pendientes:

```bash
npx wrangler d1 execute resenas-orcluxury --remote --command "SELECT id, nombre, estrellas, texto FROM resenas WHERE aprobada=0"
```

Aprobar una (aparece en la web en segundos):

```bash
npx wrangler d1 execute resenas-orcluxury --remote --command "UPDATE resenas SET aprobada=1 WHERE id=3"
```

Borrar una:

```bash
npx wrangler d1 execute resenas-orcluxury --remote --command "DELETE FROM resenas WHERE id=3"
```

**Esto es por línea de comandos, o sea que no es práctico para el día a día del propietario.** Lo natural sería una pantalla de administración con usuario y clave donde vea las pendientes y apruebe con un botón, más un aviso cuando llegue una nueva. Es un trabajo aparte y está sin hacer.

### Volver a publicar el sitio después de un cambio

```bash
npx wrangler login
```

```bash
npx wrangler pages deploy
```

El primer comando abre el navegador para iniciar sesión y se hace una sola vez cada cierto tiempo (la sesión caduca). El segundo publica la carpeta `dist/`.

### Costos

| Concepto | Monto |
|---|---|
| Dominio | ~US$10.44 al año |
| Alojamiento (Cloudflare Pages) | US$0 |
| Base de datos de opiniones (D1) | US$0 en el plan gratuito |
| Certificado de seguridad | US$0 |
| **Total recurrente** | **~US$10.44 al año** |

### Qué contiene el proyecto

```
sitio-para-subir/
  index.html            el sitio en español
  en/index.html         el sitio en inglés
  404.html              página de error
  fotos/                20 fotos de destinos + vehículo + portada
  fotos/completas/      las mismas fotos sin recortar, para el visor
  fotos/resenas/        fotos de quienes dejan opiniones (vacía)
functions/api/resenas.js   la API de opiniones
esquema.sql                estructura de la base de datos
wrangler.toml              configuración del despliegue
dist/                      lo que se publica (se regenera)
```

---

## PARTE 4 — Lo que queda pendiente

Ninguno de estos puntos impide que el sitio funcione. Van ordenados por lo que más aportaría:

1. **Ficha de Google Business Profile.** Gratis, la crea el propietario. Para un transporte local vale más que cualquier optimización del sitio: es donde busca un turista. **Es lo primero que haría.**
2. **Opiniones reales.** El formulario está listo y funcionando; la sección aparece vacía porque todavía no hay ninguna aprobada.
3. **Correo del dominio.** `info@orcluxurytransport.com` reenviando al Gmail actual, gratis desde Cloudflare (*Email Routing*). Hoy en contacto aparece un correo personal.
4. **Panel de administración de opiniones**, para no depender de la línea de comandos.
5. **Autorización de las fotos con pasajeros.** Varias fotos del carrusel muestran caras identificables de clientes. Conviene tener su permiso por escrito.
6. **Analítica de visitas.** Cloudflare Web Analytics, gratis y sin cookies.
7. **Logotipo real.** Hoy el ícono de la pestaña es una letra generada.

---

## Notas técnicas para quien continúe el proyecto

- Sin frameworks ni dependencias: HTML, CSS y JavaScript puro. No hay nada que compilar.
- El formulario de reserva no usa servidor: arma el mensaje y abre WhatsApp (`50768026916`, configurable en `CONFIG.whatsapp`).
- Las opiniones sí usan servidor: `POST /api/resenas` guarda sin aprobar, `GET /api/resenas` devuelve solo las aprobadas. El texto se escapa antes de mostrarse, así que una opinión no puede inyectar código.
- Contra robots: campo trampa oculto, límites de longitud y validación en el servidor.
- La versión inglesa es una copia traducida. **Si cambia un texto en español, hay que cambiarlo también en `en/index.html`.**
- Las fechas del formulario en inglés se escriben con el nombre del mes a propósito, para que no haya confusión entre los formatos día/mes y mes/día.
