# Mensualista — proto

Marketplace de eventos y clases. Tres roles (Empresa, Particular, Visitante), QR
por entrada, scanner de validación y un checkout estilo Stripe simulado.

Aplicación Next.js (App Router) con SQLite local vía Prisma. No usa servicios
externos: corre 100% en tu máquina con un solo comando.

## Cómo correrlo en local

Necesitas Node 20+ y npm.

```bash
npm install
npm run db:push      # crea ./prisma/dev.db con datos demo
npm run dev          # http://localhost:3000
```

`npm run db:push` ejecuta `prisma db push` y luego siembra una empresa demo
(Estudio Aurora con 3 clases + 1 pack de 5), un particular (Carla con 2
eventos gratis) y un visitante (Julián) con un ticket de muestra.

Para reiniciar los datos de demo desde cero:

```bash
rm prisma/dev.db && npm run db:push
```

## Cómo usarlo

En la barra superior, a la derecha, hay un selector de rol. Cambialo cuando
quieras probar otro flujo — la pantalla se actualiza al instante.

- **Visitante**: ve `/explorar`, abrí cualquier listing, inscribite o pagá. Tu
  QR queda en `/mis-entradas`.
- **Empresa** (Estudio Aurora): `/empresa` para tus listings, `/empresa/nueva`
  para crear, `/empresa/scanner` para validar QRs.
- **Particular** (Carla): `/particular` y `/particular/nuevo` para eventos
  gratis personales.

### Demo del scanner en una sola máquina

1. Abrí dos ventanas del navegador, lado a lado.
2. En la primera, dejá el rol en **Visitante**, comprá una clase o un pack y
   abrí el ticket. Vas a ver el QR y, debajo, el código en texto.
3. En la segunda, cambiá a **Empresa** y andá a `/empresa/scanner`.
4. Apuntá la cámara al QR de la otra ventana — o copiá el código de texto y
   pegalo en el campo "Pegar código manualmente".

## Tutoriales

Cada pantalla principal trae un tutorial con spotlight (foco animado sobre el
botón o sección) y tooltip con botones **Atrás / Siguiente / Saltar**. Las
transiciones entre pasos son animadas con Framer Motion.

- Se dispara la primera vez que entrás a una pantalla con tour disponible.
- En la barra superior aparece un botón **Tutorial** para volver a verlo.
- Atajos de teclado: `←` `→` para navegar, `Esc` para cerrar.

Tutoriales incluidos: landing, explorar, detalle de listing, mis entradas,
panel de empresa, formulario de nueva clase, scanner, panel de particular,
formulario de nuevo evento, ticket, checkout.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS para estilos
- Prisma + SQLite (archivo local `prisma/dev.db`)
- `qrcode` para generar QRs, `html5-qrcode` para leerlos con cámara
- Framer Motion para las animaciones de tutoriales y modales

## Comandos útiles

```bash
npm run dev          # servidor de desarrollo
npm run build        # build de producción
npm run typecheck    # tsc --noEmit
npm run db:seed      # repobla la DB sin re-crear el schema
```

## Notas

- El "checkout Stripe" es totalmente simulado. Cualquier número de 16 dígitos
  aprueba; vacío falla a propósito. No se cobra dinero real.
- La autenticación está reemplazada por un selector de rol; el id de usuario se
  toma de los datos seed. No hay registro ni recuperación de contraseña.
- Los packs son un único QR escaneable N veces: cada validación descuenta un
  uso hasta agotarse.
