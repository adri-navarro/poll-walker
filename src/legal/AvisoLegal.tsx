import AppLink from '../components/AppLink.tsx';
import { useI18n } from '../i18n.tsx';
import { LEGAL } from '../legal.config.ts';
import LegalLayout, { Email } from './LegalLayout.tsx';

function Es() {
  return (
    <>
      <h2>1. Datos identificativos del titular</h2>
      <p>
        En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la
        Información y de Comercio Electrónico (LSSI-CE), se informa de los datos del titular del
        sitio web <strong>{LEGAL.SITE_DOMAIN}</strong> (en adelante, «Poll Walker» o «el sitio»):
      </p>
      <ul>
        <li>Titular: {LEGAL.OWNER_NAME}</li>
        <li>NIF/CIF: {LEGAL.OWNER_NIF}</li>
        <li>Domicilio: {LEGAL.OWNER_ADDRESS}</li>
        <li>
          Correo electrónico de contacto: <Email />
        </li>
        <li>
          Proveedor de alojamiento: {LEGAL.HOSTING_PROVIDER} ({LEGAL.HOSTING_PROVIDER_LOCATION})
        </li>
      </ul>

      <h2>2. Objeto del sitio</h2>
      <p>
        Poll Walker es un servicio gratuito que permite a cualquier persona crear encuestas,
        compartirlas mediante un enlace y votar en ellas, viendo los resultados en directo. No
        requiere registro, no se venden bienes ni servicios y no incluye publicidad.
      </p>

      <h2>3. Propiedad intelectual e industrial</h2>
      <p>
        El diseño, el código fuente y los elementos propios del sitio pertenecen a su titular o se
        utilizan con la correspondiente licencia. Queda prohibida su reproducción o distribución
        con fines comerciales sin autorización, salvo lo permitido por las licencias aplicables o
        por la ley. Los textos de las encuestas y las opciones son contenido aportado por los
        usuarios, que conservan los derechos sobre el mismo y son responsables de poder publicarlo
        (véanse los <AppLink href="/terminos">Términos de uso</AppLink>).
      </p>

      <h2>4. Responsabilidad y disponibilidad</h2>
      <p>
        El titular se esfuerza por mantener el sitio disponible y la información correcta, pero no
        garantiza la ausencia de interrupciones, errores o pérdida de datos, y puede modificar,
        suspender o retirar el servicio en cualquier momento. El titular no responde de los
        contenidos creados por los usuarios, sin perjuicio de retirarlos cuando tenga conocimiento
        efectivo de su ilicitud (arts. 16 y 17 LSSI-CE) conforme al procedimiento descrito en los
        Términos de uso. Esta limitación no excluye la responsabilidad que no pueda excluirse
        legalmente.
      </p>

      <h2>5. Enlaces externos</h2>
      <p>
        Los usuarios pueden incluir enlaces a páginas de terceros en las opciones de sus
        encuestas. El titular no controla esos sitios, no se hace responsable de su contenido,
        disponibilidad ni políticas de privacidad, y la presencia de un enlace no implica
        recomendación alguna. Se recomienda precaución al abrirlos. Si detectas un enlace ilícito
        o malicioso, comunícalo a <Email />.
      </p>

      <h2>6. Protección de datos y cookies</h2>
      <p>
        El tratamiento de datos personales se describe en la{' '}
        <AppLink href="/privacidad">Política de privacidad</AppLink> y el uso de cookies y
        almacenamiento local en la <AppLink href="/cookies">Política de cookies</AppLink>.
      </p>

      <h2>7. Legislación aplicable y jurisdicción</h2>
      <p>
        Este aviso legal se rige por la legislación española. Para cualquier controversia, las
        partes se someten a los juzgados y tribunales que correspondan conforme a la normativa
        aplicable; cuando el usuario tenga la condición de consumidor, serán competentes los de su
        domicilio.
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
      <h2>1. Owner identification</h2>
      <p>
        In compliance with article 10 of Spanish Law 34/2002 on Information Society Services and
        Electronic Commerce (LSSI-CE), the following are the details of the owner of the website{' '}
        <strong>{LEGAL.SITE_DOMAIN}</strong> (&ldquo;Poll Walker&rdquo; or &ldquo;the
        site&rdquo;):
      </p>
      <ul>
        <li>Owner: {LEGAL.OWNER_NAME}</li>
        <li>Tax ID (NIF/CIF): {LEGAL.OWNER_NIF}</li>
        <li>Address: {LEGAL.OWNER_ADDRESS}</li>
        <li>
          Contact email: <Email />
        </li>
        <li>
          Hosting provider: {LEGAL.HOSTING_PROVIDER} ({LEGAL.HOSTING_PROVIDER_LOCATION})
        </li>
      </ul>

      <h2>2. Purpose of the site</h2>
      <p>
        Poll Walker is a free service that lets anyone create polls, share them with a link and
        vote, with results shown live. No registration is required, nothing is sold and there is
        no advertising.
      </p>

      <h2>3. Intellectual property</h2>
      <p>
        The design, source code and original elements of the site belong to its owner or are used
        under licence. Commercial reproduction or distribution without authorisation is
        prohibited, except as allowed by applicable licences or by law. Poll text and options are
        content supplied by users, who keep their rights over it and are responsible for having
        the right to publish it (see the <AppLink href="/terminos">Terms of use</AppLink>).
      </p>

      <h2>4. Liability and availability</h2>
      <p>
        The owner strives to keep the site available and its information correct, but does not
        guarantee the absence of interruptions, errors or data loss, and may change, suspend or
        withdraw the service at any time. The owner is not responsible for user-created content,
        without prejudice to removing it once there is actual knowledge that it is unlawful
        (arts. 16 and 17 LSSI-CE) following the procedure in the Terms of use. This limitation does
        not exclude liability that cannot be excluded by law.
      </p>

      <h2>5. External links</h2>
      <p>
        Users may add links to third-party pages in their poll options. The owner does not control
        those sites and is not responsible for their content, availability or privacy practices;
        a link is not an endorsement. Please be careful when opening them. If you find an unlawful
        or malicious link, report it to <Email />.
      </p>

      <h2>6. Data protection and cookies</h2>
      <p>
        Personal data processing is described in the{' '}
        <AppLink href="/privacidad">Privacy policy</AppLink> and the use of cookies and local
        storage in the <AppLink href="/cookies">Cookie policy</AppLink>.
      </p>

      <h2>7. Governing law and jurisdiction</h2>
      <p>
        This legal notice is governed by Spanish law. Any dispute will be submitted to the courts
        that are competent under applicable rules; where the user is a consumer, the courts of the
        user&rsquo;s domicile will be competent.
      </p>
    </>
  );
}

export default function AvisoLegal() {
  const { lang } = useI18n();
  return <LegalLayout titleKey="aviso">{lang === 'en' ? <En /> : <Es />}</LegalLayout>;
}
