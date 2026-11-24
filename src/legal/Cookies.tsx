import AppLink from '../components/AppLink.tsx';
import { useI18n } from '../i18n.tsx';
import LegalLayout from './LegalLayout.tsx';

function Es() {
  return (
    <>
      <h2>1. Qué usamos</h2>
      <p>
        Poll Walker no usa cookies de terceros, ni de análisis, ni de publicidad, ni de
        seguimiento. Solo utiliza los siguientes elementos, todos propios (<em>first-party</em>):
      </p>
      <div className="legal-table-wrap">
        <table className="legal-table">
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Titular</th>
              <th scope="col">Finalidad</th>
              <th scope="col">Duración</th>
              <th scope="col">Tipo</th>
              <th scope="col">¿Necesaria?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">
                <code>pw_voter_id</code>
              </th>
              <td>Este sitio (propia)</td>
              <td>
                Identificador aleatorio del votante para evitar votos duplicados y permitirte
                editar tu voto. Solo se crea la primera vez que votas. Es HttpOnly y SameSite=Lax; el
                atributo Secure se activa cuando el sitio se sirve por HTTPS a través de la
                configuración de proxy inverso incluida.
              </td>
              <td>1 año</td>
              <td>Cookie técnica</td>
              <td>Sí (exenta)</td>
            </tr>
            <tr>
              <th scope="row">
                <code>theme</code>
              </th>
              <td>Este sitio (propia)</td>
              <td>Recuerda tu elección de tema claro u oscuro.</td>
              <td>Hasta que la borres</td>
              <td>Almacenamiento local (localStorage)</td>
              <td>Sí (preferencia elegida por ti, exenta)</td>
            </tr>
            <tr>
              <th scope="row">
                <code>lang</code>
              </th>
              <td>Este sitio (propia)</td>
              <td>Recuerda tu idioma (español o inglés).</td>
              <td>Hasta que la borres</td>
              <td>Almacenamiento local (localStorage)</td>
              <td>Sí (preferencia elegida por ti, exenta)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>2. Por qué no hay banner de cookies</h2>
      <p>
        El artículo 22.2 de la LSSI-CE exige consentimiento para almacenar o acceder a información
        en tu dispositivo, salvo que sea estrictamente necesario para prestar un servicio que has
        solicitado expresamente o para realizar la comunicación. Consideramos que{' '}
        <code>pw_voter_id</code> encaja en esa excepción porque es imprescindible para registrar
        tu voto una sola vez y poder editarlo; solo se establece cuando votas, nunca por el mero
        hecho de visitar el sitio. <code>theme</code> y <code>lang</code> guardan preferencias que
        eliges activamente en la interfaz y no se usan para identificarte ni seguirte. Por eso no
        pedimos consentimiento. Si en el futuro se añadiera cualquier cookie no exenta, se
        solicitaría antes tu consentimiento.
      </p>

      <h2>3. Cómo borrarlas o gestionarlas</h2>
      <p>
        Puedes eliminar la cookie y el almacenamiento local en cualquier momento desde los ajustes
        de tu navegador (borrar datos de sitios), o bloquearlas. Consecuencias: si borras{' '}
        <code>pw_voter_id</code> dejarás de poder editar tu voto anterior y, cuando la comprobación
        por IP no resulte aplicable (por ejemplo, si cambias de red), podrías llegar a votar de
        nuevo en la misma encuesta. Si borras <code>theme</code> o <code>lang</code>, el sitio
        volverá a usar el tema y el idioma de tu sistema o navegador.
      </p>

      <h2>4. Más información</h2>
      <p>
        El tratamiento de datos asociado al voto (incluido el identificador y el hash de la IP) se
        explica en la <AppLink href="/privacidad">Política de privacidad</AppLink>.
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
      <h2>1. What we use</h2>
      <p>
        Poll Walker uses no third-party, analytics, advertising or tracking cookies. It only uses
        the following items, all first-party:
      </p>
      <div className="legal-table-wrap">
        <table className="legal-table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Provider</th>
              <th scope="col">Purpose</th>
              <th scope="col">Duration</th>
              <th scope="col">Type</th>
              <th scope="col">Necessary?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">
                <code>pw_voter_id</code>
              </th>
              <td>This site (first-party)</td>
              <td>
                Random voter identifier used to prevent duplicate votes and let you edit your vote.
                It is only created the first time you vote. It is HttpOnly and SameSite=Lax; the
                Secure flag is set when the site is served over HTTPS through the bundled reverse
                proxy configuration.
              </td>
              <td>1 year</td>
              <td>Technical cookie</td>
              <td>Yes (exempt)</td>
            </tr>
            <tr>
              <th scope="row">
                <code>theme</code>
              </th>
              <td>This site (first-party)</td>
              <td>Remembers your light or dark theme choice.</td>
              <td>Until you clear it</td>
              <td>Local storage (localStorage)</td>
              <td>Yes (preference chosen by you, exempt)</td>
            </tr>
            <tr>
              <th scope="row">
                <code>lang</code>
              </th>
              <td>This site (first-party)</td>
              <td>Remembers your language (Spanish or English).</td>
              <td>Until you clear it</td>
              <td>Local storage (localStorage)</td>
              <td>Yes (preference chosen by you, exempt)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>2. Why there is no cookie banner</h2>
      <p>
        Article 22.2 of the LSSI-CE requires consent to store or access information on your
        device unless it is strictly necessary to provide a service you explicitly requested or to
        carry out the communication. We consider that <code>pw_voter_id</code> falls under that
        exception because it is essential to record your vote once and let you edit it; it is only
        set when you vote, never merely by visiting the site. <code>theme</code> and{' '}
        <code>lang</code> store preferences you actively choose in the interface and are not used
        to identify or track you. Therefore we do not ask for consent. If a non-exempt cookie were
        ever added, your consent would be requested first.
      </p>

      <h2>3. How to delete or manage them</h2>
      <p>
        You can delete the cookie and local storage at any time in your browser settings (clear
        site data), or block them. Consequences: if you delete <code>pw_voter_id</code> you will
        no longer be able to edit your previous vote and, where the IP check does not apply (for
        example, if you change network), you might be able to vote again in the same poll. If you
        delete <code>theme</code> or <code>lang</code>, the site will go back to your system or
        browser theme and language.
      </p>

      <h2>4. More information</h2>
      <p>
        The data processing associated with voting (including the identifier and the IP hash) is
        explained in the <AppLink href="/privacidad">Privacy policy</AppLink>.
      </p>
    </>
  );
}

export default function Cookies() {
  const { lang } = useI18n();
  return <LegalLayout titleKey="cookies">{lang === 'en' ? <En /> : <Es />}</LegalLayout>;
}
