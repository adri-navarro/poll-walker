import AppLink from '../components/AppLink.tsx';
import { useI18n } from '../i18n.tsx';
import { LEGAL } from '../legal.config.ts';
import LegalLayout, { Email } from './LegalLayout.tsx';

function Es() {
  return (
    <>
      <h2>1. Responsable del tratamiento</h2>
      <ul>
        <li>Responsable: el sitio {LEGAL.SITE_DOMAIN}</li>
        <li>
          Contacto para cuestiones de privacidad: <Email />
        </li>
        <li>Sitio web: {LEGAL.SITE_DOMAIN}</li>
      </ul>
      <p>
        Poll Walker no requiere cuenta, no recoge correos electrónicos de los votantes, no tiene
        pagos, analítica, publicidad ni scripts, fuentes o CDN de terceros.
      </p>

      <h2>2. Tratamientos, finalidades, base jurídica y conservación</h2>
      <div className="legal-table-wrap">
        <table className="legal-table">
          <thead>
            <tr>
              <th scope="col">Tratamiento</th>
              <th scope="col">Datos</th>
              <th scope="col">Finalidad</th>
              <th scope="col">Base jurídica</th>
              <th scope="col">Conservación</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Creación y publicación de encuestas</th>
              <td>
                Pregunta, descripción, opciones (texto, notas y enlaces opcionales) y fecha de
                creación.
              </td>
              <td>
                Prestar el servicio solicitado: crear la encuesta, compartirla por enlace y
                mostrarla en la lista pública de las 12 encuestas más recientes.
              </td>
              <td>Art. 6.1.b RGPD (ejecución del servicio solicitado)</td>
              <td>
                {LEGAL.RETENTION_MONTHS} meses desde la última actividad (creación o cualquier
                voto o edición de voto); después se elimina automáticamente.
              </td>
            </tr>
            <tr>
              <th scope="row">Votación y prevención de duplicados</th>
              <td>
                Opciones elegidas, fecha y hora, identificador aleatorio de votante (UUID, también
                en la cookie <code>pw_voter_id</code>) y hash de la IP por encuesta.
              </td>
              <td>
                Registrar tu voto, evitar votos duplicados, permitirte editar tu voto y prevenir
                abusos.
              </td>
              <td>
                Art. 6.1.b RGPD (registrar y editar tu voto) y art. 6.1.f (interés legítimo en la
                integridad de las encuestas y la prevención de abusos)
              </td>
              <td>
                Igual que la encuesta: {LEGAL.RETENTION_MONTHS} meses desde la última actividad,
                con borrado automático junto con la encuesta.
              </td>
            </tr>
            <tr>
              <th scope="row">Nombre de votante (nombre o apodo) publicado junto al voto</th>
              <td>
                El nombre o apodo que tú eliges libremente (1 a 40 caracteres) y las opciones que
                has elegido.
              </td>
              <td>
                Mostrar quién ha votado qué en la encuesta y ayudar a evitar votos duplicados (no
                se admite el mismo nombre dos veces en una encuesta).
              </td>
              <td>
                Art. 6.1.b RGPD (el servicio de votación que solicitas, que muestra quién ha votado
                qué) y art. 6.1.f (interés legítimo en la transparencia y la prevención de
                duplicados). El nombre lo eliges tú y puede ser un apodo; puedes oponerte (art. 21)
                escribiendo a <Email />.
              </td>
              <td>
                Igual que la encuesta: {LEGAL.RETENTION_MONTHS} meses desde la última actividad, o
                antes si lo solicitas. Es visible públicamente para cualquiera que pueda acceder a
                la encuesta, también desde la lista de encuestas recientes y en tiempo real.
              </td>
            </tr>
            <tr>
              <th scope="row">Registros del servidor (logs)</th>
              <td>
                IP anonimizada (último octeto IPv4 puesto a cero; IPv6 truncada), fecha y hora,
                método, ruta (sin parámetros), código de respuesta, bytes y user agent. No se
                registra el referer.
              </td>
              <td>Seguridad, detección de abusos y correcto funcionamiento del servicio.</td>
              <td>Art. 6.1.f RGPD (interés legítimo en la seguridad y operación del servicio)</td>
              <td>
                Rotación automática por tamaño (3 ficheros de 10 MB por contenedor); no hay un
                plazo fijo, los registros más antiguos se sobrescriben. Esta descripción se aplica
                a la pila tal como se distribuye (nginx incluido y rotación de logs de Docker
                Compose).
              </td>
            </tr>
            <tr>
              <th scope="row">Contacto por correo electrónico</th>
              <td>Tu dirección de correo, nombre si lo indicas y el contenido de tu mensaje.</td>
              <td>Atender consultas, solicitudes de derechos y avisos de contenido ilícito.</td>
              <td>
                Art. 6.1.b RGPD si pides algo relacionado con el servicio; en otro caso art.
                6.1.f (interés legítimo en responder), o 6.1.c para cumplir obligaciones legales
                (p. ej. derechos RGPD).
              </td>
              <td>
                Durante el tiempo necesario para atender la solicitud y, después, bloqueado
                durante los plazos de prescripción de posibles responsabilidades.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>3. Categorías de datos</h2>
      <p>
        Datos que tú escribes (contenido de encuestas y opciones, y el nombre o apodo con el que
        votas), datos técnicos pseudonimizados del voto (identificador de votante, hash de IP,
        fecha), datos de registros
        con IP anonimizada y, si nos escribes, tus datos de contacto. No tratamos categorías
        especiales de datos de forma intencionada.
      </p>
      <p>
        <strong>El contenido de las encuestas es público</strong> para cualquiera que pueda
        acceder a ellas, y las 12 encuestas más recientes aparecen en la página de inicio. No incluyas datos
        personales tuyos ni de terceros (nombres, teléfonos, direcciones, datos de salud, etc.) en
        las preguntas, descripciones u opciones. Quien los publique es responsable de ello.
      </p>
      <p>
        <strong>Tu nombre y tu voto son públicos.</strong> El nombre o apodo que indiques al
        votar, junto con las opciones que elijas, es visible para cualquiera que pueda acceder a la
        encuesta, incluso desde la lista de las 12 encuestas más recientes de la página de inicio
        y en la transmisión de resultados en tiempo real. Base jurídica: art. 6.1.b RGPD (el
        servicio de votación que solicitas, que muestra quién ha votado qué) y art. 6.1.f
        (interés legítimo en la transparencia y la prevención de duplicados); no se basa en tu
        consentimiento. Puedes oponerte (art. 21) escribiendo a <Email />. Si no quieres que te
        identifiquen, usa un apodo. No introduzcas el nombre de otra persona. Los votos emitidos antes de que se pidiera nombre
        aparecen como «Anónimo».
      </p>
      <p>
        <strong>Origen de los datos:</strong> los datos proceden directamente de ti (lo que
        escribes y los datos de tu navegador y conexión). No obtenemos datos de terceros.
      </p>
      <p>
        <strong>¿Es obligatorio facilitar los datos?</strong> Para votar o crear encuestas es
        necesario tratar los datos técnicos descritos (cookie, hash y la IP en tránsito); el
        texto de las encuestas es voluntario. Para votar es obligatorio indicar un nombre (puede
        ser un apodo); para crear una encuesta no hace falta. Si no facilitas estos datos
        técnicos no podrás votar ni crear encuestas, y sin nombre no podrás votar.
      </p>
      <p>
        Dado que el nombre y el voto son públicos, cualquier persona que acceda a la encuesta
        puede verlos y copiarlos fuera del servicio; no podemos controlar ese uso posterior.
      </p>

      <h2>4. Destinatarios y encargados del tratamiento</h2>
      <p>
        El proveedor de alojamiento, {LEGAL.HOSTING_PROVIDER}, accede a los datos como encargado
        del tratamiento, con el correspondiente contrato conforme al art. 28 RGPD. No usamos otros
        proxys ni CDN. No cedemos datos a otros terceros salvo obligación legal. El contenido
        público de las encuestas, incluidos los nombres de votante y las opciones elegidas, es
        visible por cualquier persona que pueda acceder a la encuesta, incluida la lista de
        encuestas recientes y la transmisión de resultados en tiempo real.
      </p>

      <h2>5. Transferencias internacionales</h2>
      <p>
        El sitio se aloja en un servidor de {LEGAL.HOSTING_PROVIDER}. No realizamos transferencias
        internacionales de datos por nuestra parte ni utilizamos servicios de terceros fuera del
        Espacio Económico Europeo (no hay analítica, CDN, publicidad ni otros encargados). Si esto
        cambiara, se actualizará esta política.
      </p>

      <h2>6. Decisiones automatizadas y perfiles</h2>
      <p>No se toman decisiones automatizadas ni se elaboran perfiles.</p>

      <h2>7. Menores</h2>
      <p>
        El servicio no está dirigido a menores de 14 años (art. 7 LOPDGDD). Si eres menor de 14 años
        no uses el servicio; si crees que un menor ha facilitado datos, escríbenos a <Email /> y los
        eliminaremos.
      </p>

      <h2>8. Cookies y almacenamiento local</h2>
      <p>
        Consulta la <AppLink href="/cookies">Política de cookies</AppLink>: solo se usan elementos
        técnicos o de preferencia, y la cookie de votante solo se crea cuando votas.
      </p>

      <h2>9. Medidas de seguridad</h2>
      <ul>
        <li>
          Las IP no se guardan en la base de datos: se almacena únicamente un hash HMAC-SHA256 con
          clave secreta, calculado por encuesta, por lo que no sirve para relacionarte entre
          encuestas distintas.
        </li>
        <li>Registros del servidor con IP anonimizada y sin parámetros de la URL.</li>
        <li>
          Cookie de votante HttpOnly y SameSite=Lax; el atributo Secure se activa cuando el sitio
          se sirve por HTTPS a través de la configuración de proxy inverso incluida.
        </li>
        <li>
          Borrado automático de encuestas, opciones y votos tras {LEGAL.RETENTION_MONTHS} meses sin
          actividad.
        </li>
      </ul>

      <h2>10. Tus derechos</h2>
      <p>
        Puedes ejercer los derechos de acceso, rectificación, supresión, limitación del
        tratamiento, oposición y portabilidad escribiendo a <Email />, indicando el derecho que
        ejerces y la información necesaria para identificar los datos. No existe función de
        borrado manual: las solicitudes de eliminación se gestionan por correo. Puedes oponerte en
        cualquier momento a los tratamientos basados en interés legítimo. La portabilidad solo
        aplica a tratamientos basados en el art. 6.1.b RGPD (o en el consentimiento) efectuados
        por medios automatizados. Como la base jurídica no es el consentimiento, no hay
        consentimiento que retirar, pero conservas tus derechos de oposición.
      </p>
      <p>
        Para ejercer tus derechos (por ejemplo, supresión u oposición) sobre un voto con nombre,
        envía por correo el enlace de la encuesta y el nombre que usaste al votar, para que
        podamos localizar el registro. Si hace falta, podemos pedirte información adicional para
        verificar que el voto es tuyo (art. 12.6 RGPD). Los votos antiguos sin nombre solo pueden
        localizarse con el valor de tu cookie <code>pw_voter_id</code>; mientras no podamos
        identificarte, no estaremos obligados a conservar información adicional para hacerlo (art.
        11 RGPD).
      </p>
      <p>
        Si consideras que tus derechos no han sido atendidos, puedes presentar una reclamación ante
        la Agencia Española de Protección de Datos (
        <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
          www.aepd.es
        </a>
        ).
      </p>

      <h2>11. Cambios</h2>
      <p>
        Podemos actualizar esta política; la fecha de la última actualización figura al inicio. Los
        cambios relevantes se reflejarán en esta página.
      </p>
    </>
  );
}

function En() {
  return (
    <>
      <p className="legal-translation-note">
        This is a courtesy translation. The Spanish version is the reference text.
      </p>
      <h2>1. Data controller</h2>
      <ul>
        <li>Controller: the site {LEGAL.SITE_DOMAIN}</li>
        <li>
          Privacy contact: <Email />
        </li>
        <li>Website: {LEGAL.SITE_DOMAIN}</li>
      </ul>
      <p>
        Poll Walker requires no account, does not collect voters&rsquo; email addresses, and has no
        payments, analytics, advertising, or third-party scripts, fonts or CDNs.
      </p>

      <h2>2. Processing activities, purposes, legal basis and retention</h2>
      <div className="legal-table-wrap">
        <table className="legal-table">
          <thead>
            <tr>
              <th scope="col">Activity</th>
              <th scope="col">Data</th>
              <th scope="col">Purpose</th>
              <th scope="col">Legal basis</th>
              <th scope="col">Retention</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Poll creation and publication</th>
              <td>
                Question, description, options (text, optional notes and links) and creation date.
              </td>
              <td>
                Provide the requested service: create the poll, share it by link and show it in the
                public list of the 12 most recent polls.
              </td>
              <td>Art. 6.1.b GDPR (performance of the requested service)</td>
              <td>
                {LEGAL.RETENTION_MONTHS} months after the last activity (creation or any vote or
                vote edit); then deleted automatically.
              </td>
            </tr>
            <tr>
              <th scope="row">Voting and duplicate prevention</th>
              <td>
                Chosen options, timestamps, a random voter identifier (UUID, also stored in the{' '}
                <code>pw_voter_id</code> cookie) and a per-poll hash of the IP address.
              </td>
              <td>
                Record your vote, prevent duplicate votes, let you edit your vote and prevent
                abuse.
              </td>
              <td>
                Art. 6.1.b GDPR (recording and editing your vote) and art. 6.1.f (legitimate
                interest in poll integrity and abuse prevention)
              </td>
              <td>
                Same as the poll: {LEGAL.RETENTION_MONTHS} months after the last activity, deleted
                automatically together with the poll.
              </td>
            </tr>
            <tr>
              <th scope="row">Voter name (name or nickname) published next to the vote</th>
              <td>
                The name or nickname you freely choose (1 to 40 characters) and the options you
                chose.
              </td>
              <td>
                Show who voted for what in the poll and help prevent duplicate votes (the same name
                cannot be used twice in one poll).
              </td>
              <td>
                Art. 6.1.b GDPR (the voting service you request, which shows who voted for what)
                and art. 6.1.f (legitimate interest in transparency and preventing duplicates).
                You choose the name and it may be a nickname; you can object (art. 21) by writing
                to <Email />.
              </td>
              <td>
                Same as the poll: {LEGAL.RETENTION_MONTHS} months after the last activity, or
                earlier on request. It is publicly visible to anyone who can access the poll,
                including via the recent polls list and in real time.
              </td>
            </tr>
            <tr>
              <th scope="row">Server logs</th>
              <td>
                Anonymised IP (last IPv4 octet zeroed; IPv6 truncated), timestamp, method, path
                (no query string), status code, bytes and user agent. No referer is logged.
              </td>
              <td>Security, abuse detection and correct operation of the service.</td>
              <td>Art. 6.1.f GDPR (legitimate interest in security and service operation)</td>
              <td>
                Automatic rolling rotation by size (3 files of 10 MB per container); there is no
                fixed period, the oldest entries are overwritten. This description applies to the
                stack as shipped (bundled nginx and Docker Compose log rotation).
              </td>
            </tr>
            <tr>
              <th scope="row">Email contact</th>
              <td>Your email address, your name if you give it, and the content of your message.</td>
              <td>Handle enquiries, rights requests and reports of unlawful content.</td>
              <td>
                Art. 6.1.b GDPR if you ask for something related to the service; otherwise art.
                6.1.f (legitimate interest in replying), or 6.1.c to meet legal obligations (e.g.
                GDPR rights).
              </td>
              <td>
                As long as needed to handle the request and, afterwards, blocked for the limitation
                periods of possible liabilities.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>3. Data categories</h2>
      <p>
        Data you type (poll and option content, and the name or nickname you vote with),
        pseudonymised technical vote data (voter identifier, IP hash, date), logs with anonymised IP and, if you write to us, your
        contact details. We do not intentionally process special categories of data.
      </p>
      <p>
        <strong>Poll content is public</strong> to anyone who can access the poll, and the 12 most
        recent polls are listed on the home page. Do not include personal data of yours or of others
        (names, phone numbers, addresses, health data, etc.) in questions, descriptions or options.
        Whoever publishes it is responsible for it.
      </p>
      <p>
        <strong>Your name and your vote are public.</strong> The name or nickname you enter when
        voting, together with the options you choose, is visible to anyone who can access the poll,
        including through the list of the 12 most recent polls on the home page and the live
        results stream. Legal basis: art. 6.1.b GDPR (the voting service you request, which shows
        who voted for what) and art. 6.1.f (legitimate interest in transparency and preventing
        duplicates); it is not based on your consent. You can object (art. 21) by writing to{' '}
        <Email />. If you do not want to be identified, use a nickname. Do not enter
        another person&rsquo;s name. Votes cast before names were requested appear as
        &ldquo;Anonymous&rdquo;.
      </p>
      <p>
        <strong>Source of the data:</strong> the data comes directly from you (what you type and
        data from your browser and connection). We obtain no data from third parties.
      </p>
      <p>
        <strong>Is providing data mandatory?</strong> Voting or creating polls requires processing
        the technical data described (cookie, hash and the IP in transit); poll text is
        voluntary. Voting also requires a name (it may be a nickname); creating a poll does not.
        If you do not allow the technical data you will not be able to vote or create polls, and
        without a name you cannot vote.
      </p>
      <p>
        Because your name and vote are public, anyone who can access the poll can see and copy them outside
        the service; we cannot control that further use.
      </p>

      <h2>4. Recipients and processors</h2>
      <p>
        The hosting provider, {LEGAL.HOSTING_PROVIDER}, accesses data as a processor under a
        contract pursuant to art. 28 GDPR. We use no other proxy or CDN. We do not disclose data to
        other third parties except where legally required. Public poll content, including
        voter names and chosen options, is visible to anyone who can access the poll, including via the recent polls list and the live
        results stream.
      </p>

      <h2>5. International transfers</h2>
      <p>
        The site is hosted on a {LEGAL.HOSTING_PROVIDER} server. We do not carry out international
        data transfers ourselves or use third-party services outside the European Economic Area
        (there is no analytics, CDN, advertising or other processors). If this changes, this
        policy will be updated.
      </p>

      <h2>6. Automated decisions and profiling</h2>
      <p>No automated decision-making or profiling takes place.</p>

      <h2>7. Minors</h2>
      <p>
        The service is not aimed at children under 14 (art. 7 LOPDGDD). If you are under 14, do not
        use the service; if you believe a minor has provided data, write to <Email /> and we will
        delete it.
      </p>

      <h2>8. Cookies and local storage</h2>
      <p>
        See the <AppLink href="/cookies">Cookie policy</AppLink>: only technical or preference
        items are used, and the voter cookie is only created when you vote.
      </p>

      <h2>9. Security measures</h2>
      <ul>
        <li>
          IP addresses are not stored in the database: only a keyed HMAC-SHA256 hash computed per
          poll is kept, so it cannot be used to link you across different polls.
        </li>
        <li>Server logs with anonymised IP and without URL query strings.</li>
        <li>
          Voter cookie is HttpOnly and SameSite=Lax; the Secure flag is set when the site is
          served over HTTPS through the bundled reverse proxy configuration.
        </li>
        <li>
          Automatic deletion of polls, options and votes after {LEGAL.RETENTION_MONTHS} months
          without activity.
        </li>
      </ul>

      <h2>10. Your rights</h2>
      <p>
        You may exercise your rights of access, rectification, erasure, restriction of processing,
        objection and portability by writing to <Email />, stating which right you exercise and
        the information needed to identify the data. There is no manual deletion feature: erasure
        requests are handled by email. You may object at any time to processing based on legitimate
        interest. Portability applies only to processing based on art. 6.1.b GDPR (or consent)
        carried out by automated means. Since consent is not the legal basis, there is no consent
        to withdraw, but your right to object remains.
      </p>
      <p>
        To exercise your rights (for example erasure or objection) regarding a named vote, email
        us the poll link and the name you used when voting so we can locate the record. If needed,
        we may ask for additional information to verify the vote is yours (art. 12(6) GDPR). Older
        votes without a name can only be located with the value of your <code>pw_voter_id</code>{' '}
        cookie; while we cannot identify you, we are not required to keep additional information
        to do so (art. 11 GDPR).
      </p>
      <p>
        If you believe your rights have not been honoured, you may lodge a complaint with the
        Spanish Data Protection Agency (AEPD,{' '}
        <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
          www.aepd.es
        </a>
        ).
      </p>

      <h2>11. Changes</h2>
      <p>
        We may update this policy; the date of the last update is shown at the top. Relevant
        changes will be reflected on this page.
      </p>
    </>
  );
}

export default function Privacidad() {
  const { lang } = useI18n();
  return <LegalLayout titleKey="privacidad">{lang === 'en' ? <En /> : <Es />}</LegalLayout>;
}
