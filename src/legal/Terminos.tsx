import AppLink from '../components/AppLink.tsx';
import { useI18n } from '../i18n.tsx';
import { LEGAL } from '../legal.config.ts';
import LegalLayout, { Email } from './LegalLayout.tsx';

function Es() {
  return (
    <>
      <h2>1. Descripción del servicio</h2>
      <p>
        Poll Walker ({LEGAL.SITE_DOMAIN}) permite crear encuestas públicas accesibles mediante un
        enlace, votar en ellas y ver los resultados en directo, sin necesidad de cuenta. Las 12
        encuestas más recientes se muestran en la página de inicio. Al usar el servicio (por ejemplo,
        al crear una encuesta o votar) aceptas estos Términos; te recomendamos leer la{' '}
        <AppLink href="/privacidad">Política de privacidad</AppLink>.
      </p>

      <h2>2. Uso aceptable</h2>
      <p>
        Debes usar el servicio de buena fe y conforme a la ley. No puedes manipular los resultados
        (por ejemplo, intentar votar varias veces eludiendo los controles), sobrecargar o atacar el
        servicio, ni usarlo de forma automatizada para generar votos o encuestas masivas.
      </p>

      <h2>3. Contenido de los usuarios</h2>
      <p>
        Eres el único responsable del contenido que publicas (preguntas, descripciones, opciones,
        notas y enlaces). Declaras que tienes derecho a publicarlo y que no infringe derechos de
        terceros ni la ley. El contenido es público: lo ve cualquiera que pueda acceder a la
        encuesta, también desde la lista de encuestas recientes. Nos concedes una licencia no exclusiva y
        gratuita para alojarlo, mostrarlo y tratarlo técnicamente con el único fin de prestar el
        servicio.
      </p>

      <h2>4. Contenido prohibido</h2>
      <ul>
        <li>Contenido ilegal o que incite a cometer delitos.</li>
        <li>Contenido de odio, discriminatorio, violento o que haga apología del terrorismo.</li>
        <li>Acoso, amenazas, difamación o vulneración del honor, la intimidad o la propia imagen.</li>
        <li>
          Datos personales de terceros (nombres, teléfonos, direcciones, correos, datos de salud,
          etc.) sin su consentimiento.
        </li>
        <li>
          Suplantar a otras personas o usar el nombre real de otra persona como nombre de votante,
          así como nombres ofensivos o ilegales.
        </li>
        <li>Enlaces a malware, phishing, estafas o contenido ilícito.</li>
        <li>Spam, publicidad masiva o contenido engañoso.</li>
        <li>Contenido que infrinja derechos de propiedad intelectual o industrial.</li>
        <li>Contenido sexual explícito o que afecte a menores.</li>
      </ul>

      <h2>5. Notificación y retirada de contenido</h2>
      <p>
        Si encuentras contenido que consideres ilícito o contrario a estos Términos, escribe a{' '}
        <Email /> indicando el enlace de la encuesta, qué contenido es y por qué lo consideras
        ilícito, así como tus datos de contacto. Revisaremos el aviso con diligencia y retiraremos
        el contenido cuando proceda. Nos reservamos el derecho de eliminar o ocultar, sin previo
        aviso, cualquier encuesta, opción, nombre de votante o voto que incumpla estos Términos o la ley.
        Para solicitar la retirada de un nombre o voto, escribe a <Email /> con el enlace de la
        encuesta y el nombre que aparece.
      </p>

      <h2>6. Eliminación automática</h2>
      <p>
        Las encuestas, con sus opciones y votos, se eliminan automáticamente tras{' '}
        {LEGAL.RETENTION_MONTHS} meses sin actividad (creación o votos). No hay función de borrado
        manual: para solicitar la eliminación anticipada de una encuesta, escribe a <Email />. Si
        necesitas conservar los resultados, guárdalos antes.
      </p>

      <h2>7. Sin garantías y disponibilidad</h2>
      <p>
        El servicio se ofrece «tal cual», de forma gratuita y sin garantía de disponibilidad,
        continuidad, exactitud de los resultados ni ausencia de errores. Puede modificarse,
        interrumpirse o cesar en cualquier momento. Los resultados no son una votación con validez
        jurídica ni garantizan la identidad de los votantes.
      </p>

      <h2>8. Limitación de responsabilidad</h2>
      <p>
        En la máxima medida permitida por la ley, el titular no responde de daños derivados del uso
        o imposibilidad de uso del servicio, del contenido creado por los usuarios ni de los sitios
        enlazados. Nada de lo aquí dispuesto excluye ni limita la responsabilidad que no pueda
        excluirse o limitarse legalmente, ni los derechos que la normativa reconoce a los
        consumidores.
      </p>

      <h2>9. Modificaciones</h2>
      <p>
        Podemos modificar estos Términos; la versión vigente es la publicada en esta página, con su
        fecha de actualización. El uso continuado del servicio tras un cambio supone su aceptación,
        sin perjuicio de tus derechos legales.
      </p>

      <h2>10. Legislación aplicable y jurisdicción</h2>
      <p>
        Estos Términos se rigen por la legislación española. Para cualquier controversia serán
        competentes los juzgados y tribunales que correspondan conforme a la ley; si eres
        consumidor, los del lugar de tu domicilio.
      </p>
      <p>
        Datos del titular en el <AppLink href="/aviso-legal">Aviso legal</AppLink>.
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
      <h2>1. Service description</h2>
      <p>
        Poll Walker ({LEGAL.SITE_DOMAIN}) lets you create public polls reachable by link, vote in
        them and see live results, without an account. The 12 most recent polls are shown on the
        home page. By using the service (for example, creating a poll or voting) you accept these Terms;
        we recommend you read the <AppLink href="/privacidad">Privacy policy</AppLink>.
      </p>

      <h2>2. Acceptable use</h2>
      <p>
        You must use the service in good faith and lawfully. You may not manipulate results (for
        example, trying to vote several times by bypassing the controls), overload or attack the
        service, or use it in an automated way to generate mass votes or polls.
      </p>

      <h2>3. User content</h2>
      <p>
        You are solely responsible for the content you publish (questions, descriptions, options,
        notes and links). You state that you have the right to publish it and that it does not
        infringe third-party rights or the law. Content is public: visible to anyone who can access
        the poll, including through the recent polls list. You grant us a non-exclusive, free licence to host,
        display and technically process it for the sole purpose of providing the service.
      </p>

      <h2>4. Prohibited content</h2>
      <ul>
        <li>Illegal content or content inciting crime.</li>
        <li>Hateful, discriminatory or violent content, or glorification of terrorism.</li>
        <li>Harassment, threats, defamation, or violation of honour, privacy or image rights.</li>
        <li>
          Personal data of third parties (names, phone numbers, addresses, emails, health data,
          etc.) without their consent.
        </li>
        <li>
          Impersonating others or using another person&rsquo;s real name as a voter name, and
          offensive or illegal names.
        </li>
        <li>Links to malware, phishing, scams or unlawful content.</li>
        <li>Spam, mass advertising or deceptive content.</li>
        <li>Content infringing intellectual or industrial property rights.</li>
        <li>Sexually explicit content or content involving minors.</li>
      </ul>

      <h2>5. Notice and takedown</h2>
      <p>
        If you find content you consider unlawful or contrary to these Terms, write to <Email />{' '}
        with the poll link, which content it is and why you consider it unlawful, plus your contact
        details. We will review the notice diligently and remove the content where appropriate. We
        reserve the right to delete or hide, without notice, any poll, option, voter name or vote
        that breaches these Terms or the law. To request removal of a name or vote, write to{' '}
        <Email /> with the poll link and the name shown.
      </p>

      <h2>6. Automatic deletion</h2>
      <p>
        Polls, with their options and votes, are automatically deleted after {LEGAL.RETENTION_MONTHS}{' '}
        months without activity (creation or votes). There is no manual delete feature: to request
        early deletion of a poll, write to <Email />. If you need to keep the results, save them
        beforehand.
      </p>

      <h2>7. No warranty and availability</h2>
      <p>
        The service is provided &ldquo;as is&rdquo;, free of charge and without any warranty of
        availability, continuity, accuracy of results or absence of errors. It may change, be
        interrupted or end at any time. Results are not a legally binding vote and do not
        guarantee the identity of voters.
      </p>

      <h2>8. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, the owner is not liable for damages arising from the
        use of or inability to use the service, from user-created content or from linked sites.
        Nothing here excludes or limits liability that cannot be excluded or limited by law, nor the
        rights the law grants to consumers.
      </p>

      <h2>9. Changes</h2>
      <p>
        We may modify these Terms; the version in force is the one published on this page, with
        its update date. Continued use of the service after a change means acceptance, without
        prejudice to your statutory rights.
      </p>

      <h2>10. Governing law and jurisdiction</h2>
      <p>
        These Terms are governed by Spanish law. Any dispute will be submitted to the competent
        courts under the law; if you are a consumer, those of your place of domicile.
      </p>
      <p>
        Owner details are in the <AppLink href="/aviso-legal">Legal notice</AppLink>.
      </p>
    </>
  );
}

export default function Terminos() {
  const { lang } = useI18n();
  return <LegalLayout titleKey="terminos">{lang === 'en' ? <En /> : <Es />}</LegalLayout>;
}
