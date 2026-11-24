import AppLink from '../components/AppLink.tsx';
import { useI18n } from '../i18n.tsx';
import { LEGAL } from '../legal.config.ts';
import LegalLayout, { Email } from './LegalLayout.tsx';

function Es() {
  return (
    <>
      <h2>1. Responsable del tratamiento</h2>
      <ul>
        <li>Responsable: {LEGAL.OWNER_NAME} (NIF/CIF: {LEGAL.OWNER_NIF})</li>
        <li>Domicilio: {LEGAL.OWNER_ADDRESS}</li>
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
        Datos que tú escribes (contenido de encuestas y opciones), datos técnicos pseudonimizados
        del voto (identificador de votante, hash de IP, fecha, opciones), datos de registros
        con IP anonimizada y, si nos escribes, tus datos de contacto. No tratamos categorías
        especiales de datos de forma intencionada.
      </p>
      <p>
        <strong>El contenido de las encuestas es público</strong> para cualquiera que tenga el
        enlace y las 12 encuestas más recientes aparecen en la página de inicio. No incluyas datos
        personales tuyos ni de terceros (nombres, teléfonos, direcciones, datos de salud, etc.) en
        las preguntas, descripciones u opciones. Quien los publique es responsable de ello.
      </p>
      <p>
        <strong>Origen de los datos:</strong> los datos proceden directamente de ti (lo que
        escribes y los datos de tu navegador y conexión). No obtenemos datos de terceros.
      </p>
      <p>
        <strong>¿Es obligatorio facilitar los datos?</strong> Para votar o crear encuestas es
        necesario tratar los datos técnicos descritos (cookie, hash y la IP en tránsito); el
        texto de las encuestas es voluntario. Si no los facilitas, no podrás usar esas funciones.
      </p>

      <h2>4. Destinatarios y encargados del tratamiento</h2>
      <p>
        El proveedor de alojamiento, {LEGAL.HOSTING_PROVIDER}, accede a los datos como encargado
        del tratamiento, con el correspondiente contrato conforme al art. 28 RGPD. No usamos otros
        proxys ni CDN. No cedemos datos a otros terceros salvo obligación legal. El contenido
        público de las encuestas es visible por cualquier persona con el enlace.
      </p>

      <h2>5. Transferencias internacionales</h2>
      <p>
        No se prevén transferencias internacionales: el proveedor aloja los datos en{' '}
        {LEGAL.HOSTING_PROVIDER_LOCATION}.
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
        Dado que los votos son pseudonimizados (no sabemos quién eres), para ejercer derechos
        sobre un voto es posible que debas aportar el enlace de la encuesta y el valor de tu cookie{' '}
        <code>pw_voter_id</code>, u otra información suficiente para identificar el registro (art.
        11 RGPD). Mientras no podamos identificarte, no estaremos obligados a conservar
        información adicional para hacerlo.
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
        <li>Controller: {LEGAL.OWNER_NAME} (Tax ID: {LEGAL.OWNER_NIF})</li>
        <li>Address: {LEGAL.OWNER_ADDRESS}</li>
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
        Data you type (poll and option content), pseudonymised technical vote data (voter
        identifier, IP hash, date, options), logs with anonymised IP and, if you write to us, your
        contact details. We do not intentionally process special categories of data.
      </p>
      <p>
        <strong>Poll content is public</strong> to anyone with the link, and the 12 most recent
        polls are listed on the home page. Do not include personal data of yours or of others
        (names, phone numbers, addresses, health data, etc.) in questions, descriptions or options.
        Whoever publishes it is responsible for it.
      </p>
      <p>
        <strong>Source of the data:</strong> the data comes directly from you (what you type and
        data from your browser and connection). We obtain no data from third parties.
      </p>
      <p>
        <strong>Is providing data mandatory?</strong> Voting or creating polls requires processing
        the technical data described (cookie, hash and the IP in transit); poll text is
        voluntary. If you do not provide them, you will not be able to use those functions.
      </p>

      <h2>4. Recipients and processors</h2>
      <p>
        The hosting provider, {LEGAL.HOSTING_PROVIDER}, accesses data as a processor under a
        contract pursuant to art. 28 GDPR. We use no other proxy or CDN. We do not disclose data to
        other third parties except where legally required. Public poll content is visible to
        anyone with the link.
      </p>

      <h2>5. International transfers</h2>
      <p>
        No international transfers are expected: the provider hosts the data in{' '}
        {LEGAL.HOSTING_PROVIDER_LOCATION}.
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
        Because votes are pseudonymous (we do not know who you are), to exercise rights regarding a
        vote you may need to provide the poll link and the value of your <code>pw_voter_id</code>{' '}
        cookie, or other information sufficient to identify the record (art. 11 GDPR). While we
        cannot identify you, we are not required to keep additional information to do so.
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
