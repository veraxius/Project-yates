# Automatizaciones de YB University en n8n

Los archivos `.json` se importan en n8n (menú ⋯ → *Import from file*). Este `LEEME.md` y los `.txt` **no** se importan: son la guía y el contenido del chatbot.

> **Nada de esto está probado en tu n8n, con tu Zoho ni con OpenAI.** El código de cada nodo "Code" se probó aparte (157 comprobaciones) y los siete flujos se ejecutaron de principio a fin con servicios **simulados** (53 simulaciones): eso detecta ramas cruzadas, expresiones mal escritas y JSON inválido, pero no puede demostrar que Zoho, Gmail, OpenAI o Qdrant acepten las llamadas. Haz una prueba real de cada flujo antes de dar nada por bueno.

## Qué hay aquí

| Archivo | Para qué sirve |
|---|---|
| `1-formularios-a-zoho-y-correos.json` | Recibe los formularios de las 6 páginas, guarda un Lead por email en Zoho con su segmento, y envía los correos |
| `2-chatbot-aviso-a-zoho-crm.json` | Cuando el chatbot pasa una conversación a una persona: contacto en Zoho + aviso al equipo |
| `3-chatbot-consulta.json` | El cerebro del chatbot: busca en la base de conocimiento y responde. Corrige TRISIAN 1 |
| `4-chatbot-sitio-web.json` | La entrada del chat (Zoho SalesIQ o widget propio). Corrige TRISIAN 6 |
| `5-chatbot-cargar-conocimiento.json` | Carga los documentos de Google Drive a Qdrant. Reemplaza TRISIAN 2 |
| `6-learnworlds-a-zoho-crm.json` | Cuando un alumno se inscribe o completa el curso, actualiza su etapa en Zoho (modo aprendizaje) |
| `7-resumen-semanal.json` | Cada lunes, correo al equipo con los contactos nuevos por página, segmento y campaña |
| `conocimiento/*.txt` | Lo que el chatbot sabe: el FAQ (58 preguntas) y los datos del programa. Súbelos a la carpeta de Drive |
| `alternativa-propia/` | Un chatbot con memoria que hice antes. **No lo importes** si usas los flujos 3 a 5 |

```
 Web ──► [1] formularios ──► Zoho + correos
 Web ──► botón "Ask us" ──► /api/chat ──► [4] chat del sitio ──► [3] consulta ──► Qdrant ◄── [5] carga ◄── Drive
                │
                └─ si hace falta una persona ──► [2] aviso ──► Zoho + correo al equipo
 LearnWorlds ──► [6] ──► Zoho            [7] ──► resumen semanal por correo
```

**No importes** `Lead Intake and Trisian Routing Engine`, `TRISIAN 03`, `TRISIAN 05` ni `ElevenAgents - Trisians`: son el embudo de ventas y la atención al cliente de WholeBranding. Tampoco uses TRISIAN 1, 2 y 6 originales: los flujos 3, 4 y 5 los reemplazan.

## Cómo ponerlo en marcha

### 1. Credenciales (n8n → Credentials)
| Credencial | Dónde se usa |
|---|---|
| **Header Auth** `X-Webhook-Secret` con la clave de los formularios | Flujo 1 |
| **Header Auth** `X-Webhook-Secret` con la **misma clave que `YB_CHAT_KEY`** | Flujos 2 y 3 |
| **Zoho OAuth2 API** (permisos de Leads, etiquetas y `ZohoCRM.coql.READ`) | Flujos 1, 2, 6 y 7 |
| **Gmail OAuth2**. **El correo sale desde esa cuenta**: elige la que debe ver el cliente | Flujos 1, 2, 6 y 7 |
| **OpenAI** | Flujos 3 y 5 |
| **Qdrant API** (URL y clave) | Flujo 5, nodo *Guardar en Qdrant* |
| **Google Drive OAuth2** | Flujo 5 |

### 2. Variables (n8n → Variables)
| Variable | Qué es |
|---|---|
| `YB_SITE_URL` | Dirección pública de la web. Si falta, usa la de Railway |
| `YB_LEADS_TEAM_EMAIL` | Quién recibe el aviso de cada formulario (flujo 1). **Una sola dirección.** Si falta, ese aviso no se envía |
| `YB_TEAM_EMAIL` | Quién recibe el aviso de escalado del chatbot (flujo 2). Admite varias direcciones separadas por coma. Si falta, ese aviso no se envía |
| `YB_SUMMARY_TEAM_EMAIL` | Quién recibe el resumen semanal (flujo 7). **Una sola dirección.** Si falta, no se envía |
| `YB_CHAT_KEY` | Clave del chat, larga y aleatoria, **mínimo 16 caracteres**. Si falta o es corta, el flujo 4 no deja entrar a nadie |
| `YB_RAG_URL` | Production URL del flujo 3 |
| `YB_CHAT_LEAD_URL` | Production URL del flujo 2 |
| `YB_QDRANT_URL` | Dirección de Qdrant, sin barra final |
| `YB_QDRANT_API_KEY` | Clave de Qdrant |
| `YB_QDRANT_COLLECTION` | Nombre de la colección de YB, por ejemplo `yb_knowledge` |
| `YB_DRIVE_FOLDER_ID` | ID de la carpeta de Drive del chatbot |
| `YB_CHAT_MODEL` | Opcional. Por defecto `gpt-4.1-mini` |

> **Usa los nombres `YB_*`, no los de WholeBranding.** En tu n8n ya existen `QDRANT_URL` y `QDRANT_COLLECTION` para los flujos de WholeBranding: si el chatbot de YB los usara, leería (y el flujo 5 borraría) el conocimiento de WholeBranding.

### 3. Campos en Zoho (módulo Leads)
Crea estos 15 campos de tipo *Single Line* y comprueba que el **nombre de API** coincide (Zoho cambia los espacios por guion bajo):

`YB Segment`, `YB Event`, `Landing Page`, `Primary Interest`, `Secondary Interests`, `UTM Source`, `UTM Medium`, `UTM Campaign`, `UTM Content`, `Referral Code`, `Consent Status`, `Last Submission Id`, `Last Submitted At`, **`YB Lifecycle`** y **`Lifecycle Updated At`**.

En `YB Lifecycle` pon como **valor predeterminado "Lead"**. Las etapas son: Lead → Enrolled → Completed. Si tu Zoho no es de EE. UU., cambia `zohoapis.com` por `zohoapis.eu`, `.in` o `.com.au` en los nodos de Zoho.

### 4. Orden de activación
1. **Flujo 5** y el contenido: ejecuta *Manual: crear la colección* (solo la primera vez), sube `conocimiento/*.txt` a la carpeta de Drive y ejecuta *Manual: cargar todo ahora*.
2. **Flujo 3**: actívalo y copia su Production URL en `YB_RAG_URL`.
3. **Flujo 2**: actívalo y copia su Production URL en `YB_CHAT_LEAD_URL`.
4. **Flujo 4**: actívalo y pon en Railway `N8N_CHAT_URL` (su Production URL) y `N8N_CHAT_KEY` (el valor de `YB_CHAT_KEY`) para que aparezca el botón del chat en la web.
5. **Flujo 1**: actívalo y pon en Railway `N8N_LEADS_WEBHOOK_URL` (su Production URL) y `N8N_LEADS_WEBHOOK_SECRET` (la clave del flujo 1).
6. **Flujo 6**: actívalo y pega su URL en los webhooks de LearnWorlds.
7. **Flujo 7**: pruébalo con *Manual: probar ahora* y actívalo.

### 5. Pruebas sin la web
Con el flujo **activo**, tu URL y tu clave (no pegues la clave en ningún chat):

```bash
curl -X POST "URL_DEL_FLUJO_4" \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: TU_YB_CHAT_KEY" \
  -d '{"question":"How many modules does the program have?"}'
```
Debe responder `{"answer":"...","escalationNeeded":false}`.

```bash
curl -X POST "URL_DEL_FLUJO_1" \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: TU_CLAVE_DE_FORMULARIOS" \
  -d '{"submission_id":"prueba-1","submitted_at":"2026-11-11T12:00:00.000Z","source":"ybuniversity.com","event":"discovery_pass_registration","segment":"GENZ_EXPLORER","landing_page":"/discover","name":"Prueba Uno","first_name":"Prueba","email":"tu-correo@example.com","primary_interest":"technology","secondary_interests":[],"answers":{"primary_interest":"technology"},"consent_status":"granted","consent_text":"","utm_source":"prueba","utm_medium":"","utm_campaign":"","utm_content":"","referral_code":""}'
```
Debe responder `{"ok":true}`, crear un Lead con la etiqueta `GENZ_EXPLORER` y enviar "Your YB Discovery Pass request". Usa un correo tuyo.

## Correos de los formularios

| Formulario | Correo a la persona |
|---|---|
| `/discover` y `/discovery-pass` | "Your YB Discovery Pass request" |
| `/reinvent` | "We received your inquiry about YB University" |
| `/entrepreneurs` | "We received your inquiry about the business of yachting" |
| `/creators` | "Your YB Creators Collective application" |
| `/campus` | "Welcome to the YB Campus Crew" |

El correo depende del **tipo de formulario**, no del segmento: quien se registra en `/discovery-pass` interesado en contenido recibe el Discovery Pass, no el de solicitud de creadores. El equipo recibe además un resumen de cada envío.

**Los textos son borradores sin aprobar.** Solo confirman la recepción y no prometen empleo, ingresos, licencias ni acceso a yates. Lo que recibe cada persona con el Discovery Pass sigue sin definirse. Para cambiar un texto, edita el nodo *Decidir y armar correos*, sección `TEMPLATES`.

**Protección contra abuso:** cualquiera puede escribir el email de **otra persona** en un formulario. Por eso a una misma dirección se le envía como máximo **un correo cada 24 horas** y hay un tope diario (200 a personas, 100 al equipo). Los contactos se guardan igual. Los contadores solo funcionan con el flujo **activo**.

## El chatbot

**Qué cambió respecto a TRISIAN 1, 2 y 6:**

| Antes | Ahora |
|---|---|
| Webhooks de consulta e ingesta **sin autenticación**: cualquiera gastaba tu cuota de OpenAI y podía escribir en el conocimiento del chatbot | Con clave. El webhook público de ingesta **no existe** |
| Una comilla en el mensaje rompía el chat; la pregunta llegaba con un `=` delante | El cuerpo se arma con `JSON.stringify`; la pregunta llega limpia |
| Prompt de WholeBranding; escalaba por preguntas de precio | Prompt de YB: responde solo con el contexto, no promete empleo, ingresos, licencias, prácticas ni acceso a yates, y **no escala por precio** |
| **Cada chat generaba dos avisos** (TRISIAN 1 y 6 escalaban los dos) | Solo el flujo 4 avisa, y un mismo chat da **un aviso cada 6 horas** |
| El escalado iba al embudo de WholeBranding | Va al flujo 2: contacto en Zoho y correo al equipo de YB |
| Enviaba el email y la pregunta a Google Analytics | Ya no |
| Cada ejecución duplicaba el conocimiento | Borra la versión anterior del archivo antes de guardar |
| Carpeta de Drive de WholeBranding; solo texto plano | Carpeta por variable; lee PDF, Word, CSV, texto y Google Docs |
| Sin nada en la base, el modelo improvisaba | Sin resultados no llama al modelo y manda al contacto |
| Sin tope de gasto | Tope de 3000 preguntas al día y de 800 tokens por respuesta |

**Sobre el conocimiento:** el chatbot dirá lo que haya en `conocimiento/`. 8 respuestas del FAQ todavía dicen que un dato "se publicará" o "se está desarrollando" (costo, planes de pago, becas, duración del acceso, horarios de estudio, el YB Yacht Challenge, las prácticas y quién está detrás de YB University), y el chatbot las repetirá así. Actualiza `lib/faq.json` cuando el cliente confirme los datos y vuelve a generar el `.txt`.

**Widget propio o Zoho SalesIQ:** el flujo 4 sirve para los dos y detecta cuál es por la forma del mensaje. La web usa el widget propio.
- *SalesIQ:* apunta el webhook del bot a la URL del flujo 4 añadiendo `?key=` y la clave. La web tendría que cargar su script y la política de seguridad actual (`script-src 'self'`, `frame-src 'none'`) lo bloquea: habría que ampliarla, y es una decisión de seguridad.
- *Widget propio (el que eligió el cliente):* **ya está en la web** como el botón "Ask us" de las páginas normales (no aparece en las landing pages, que deben tener un solo botón). El navegador solo habla con `/api/chat` de la web; esa ruta guarda la dirección y la clave de n8n y llama al flujo 4. Para encenderlo, en Railway pon `N8N_CHAT_URL` (la Production URL del flujo 4) y `N8N_CHAT_KEY` (**el mismo valor que la Variable `YB_CHAT_KEY`**). Sin las dos, el botón **sigue apareciendo**, pero su ventana avisa de que el asistente casi está listo y lleva al FAQ y a contacto, sin caja de mensaje. Al poner las dos variables, el chat funciona solo. La web lee las variables al compilar, así que Railway vuelve a desplegar al cambiarlas.
- *Cómo se porta:* cada pregunta se responde **por separado**: el chat no recuerda las anteriores. Así las respuestas dependen solo del contenido aprobado y el gasto es predecible, pero "¿y cuánto cuesta eso?" sin decir qué, no se entiende.
- *Límites en la web:* 30 mensajes por dirección y 300 en total cada 10 minutos, 500 caracteres por mensaje. Además el flujo 3 tiene su tope diario.

**Dos advertencias del modelo:** si cambias `YB_CHAT_MODEL` a uno que "razona", sube `max_completion_tokens` en el nodo *Armar petición*. Y las embeddings son `text-embedding-3-large` (3072 dimensiones): la colección debe crearse con ese tamaño, y el flujo 5 trae el nodo que lo hace.

## LearnWorlds (flujo 6)

**LearnWorlds no publica el formato exacto de sus eventos y yo no lo he visto.** El flujo busca el email y el tipo de evento donde suelen venir y **solo toca Zoho si reconoce las dos cosas**; lo demás te llega por correo con el detalle, para ajustarlo. Mientras `LEARNING_MODE` sea `true` (nodo *Reconocer evento*), recibes también los 10 primeros eventos del día. Cuando el formato esté confirmado, ponlo en `false`.

- "Pago completado" cuenta como *Enrolled*, no como *Completed*. Bajas y reembolsos no cambian la etapa.
- Si el contacto ya existe, solo cambia la etapa: no toca nombre ni apellido.
- **La dirección del webhook es la clave** (lleva un código largo al final): no la compartas.
- No verifica la firma del webhook, porque no sé si tu plan la incluye. No distingue el orden de los eventos y no hay etapa "Active Learner" (cada lección sería una escritura en Zoho).

## Lo que no está hecho y por qué

| Falta | Por qué |
|---|---|
| Correos de seguimiento (nurture) | Necesitan texto aprobado y un enlace para darse de baja; son marketing y exigen consentimiento (la web ya lo guarda en `Consent_Status`) |
| Invitaciones a sesiones informativas y a eventos | Todavía no hay sesiones ni eventos definidos |
| Cola de revisión de creadores y embajadores | No hay criterios de selección. Hoy el equipo recibe un correo por cada solicitud |
| Tasa de conversión por landing page | Hacen falta las visitas, que salen de la analítica, no de Zoho (el flujo 7 cuenta contactos) |
| Memoria de la conversación en el chat | Cada pregunta se responde sola. Añadirla exige enviar el historial y vigilar el gasto y que no cambie lo aprobado |
| Aviso de que el chat guarda datos | La política de privacidad ya lo menciona, pero esos textos siguen pendientes de revisión legal |
| Borrar del conocimiento los archivos eliminados de Drive | Drive no avisa de los borrados; hay que quitarlos de Qdrant a mano |

## Preguntas abiertas
1. ¿Los contactos de YB van al **mismo Zoho** que los de WholeBranding o a uno aparte? Estos flujos escriben en Leads con campos `YB_*`.
2. ¿Desde **qué buzón** salen los correos a los clientes de YB?
3. ¿Quién aprueba el **texto** de los correos?
4. ¿Cuál es el **sexto público** que menciona Ant? El documento solo define cinco.
5. El FAQ dice "Palm Beach Yacht Sales" y la web "Palm Beach Yachts": ¿cuál es el nombre correcto?
