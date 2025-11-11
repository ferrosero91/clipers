import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Términos y Condiciones - Clipers",
  description: "Términos y condiciones de uso de la plataforma Clipers",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Términos y Condiciones
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Fecha de última actualización:</strong> {new Date().toLocaleDateString('es-ES')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Aceptación de los Términos
              </h2>
              <p className="text-gray-700 mb-4">
                Al acceder y utilizar la plataforma Clipers, aceptas estar sujeto a estos términos y condiciones de uso. Si no estás de acuerdo con alguno de estos términos, no debes utilizar nuestros servicios.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Descripción del Servicio
              </h2>
              <p className="text-gray-700 mb-4">
                Clipers es una plataforma digital que conecta profesionales independientes con empresas y particulares que buscan servicios especializados. Facilitamos:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Creación de perfiles profesionales</li>
                <li>Publicación de ofertas de trabajo</li>
                <li>Búsqueda y contratación de servicios</li>
                <li>Sistema de comunicación entre usuarios</li>
                <li>Gestión de proyectos y pagos</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Registro y Cuenta de Usuario
              </h2>
              <p className="text-gray-700 mb-4">
                Para utilizar nuestros servicios, debes:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Ser mayor de 18 años o tener autorización parental</li>
                <li>Proporcionar información veraz y actualizada</li>
                <li>Mantener la confidencialidad de tu cuenta</li>
                <li>Ser responsable de todas las actividades en tu cuenta</li>
                <li>Notificar inmediatamente cualquier uso no autorizado</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Uso Aceptable
              </h2>
              <p className="text-gray-700 mb-4">
                Al utilizar Clipers, te comprometes a:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Cumplir con todas las leyes aplicables</li>
                <li>Respetar los derechos de otros usuarios</li>
                <li>No publicar contenido ofensivo, ilegal o inapropiado</li>
                <li>No utilizar la plataforma para actividades fraudulentas</li>
                <li>No interferir con el funcionamiento de la plataforma</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Contenido del Usuario
              </h2>
              <p className="text-gray-700 mb-4">
                Eres responsable del contenido que publicas en la plataforma. Al subir contenido, garantizas que:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Tienes los derechos necesarios sobre el contenido</li>
                <li>El contenido no viola derechos de terceros</li>
                <li>El contenido cumple con nuestras políticas</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Pagos y Tarifas
              </h2>
              <p className="text-gray-700 mb-4">
                Clipers puede cobrar tarifas por ciertos servicios. Todas las tarifas serán claramente comunicadas antes de que incurras en ellas. Los pagos son procesados de forma segura a través de proveedores de pago certificados.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Limitación de Responsabilidad
              </h2>
              <p className="text-gray-700 mb-4">
                Clipers actúa como intermediario entre usuarios. No somos responsables de:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>La calidad de los servicios prestados por los usuarios</li>
                <li>Disputas entre usuarios</li>
                <li>Pérdidas económicas derivadas del uso de la plataforma</li>
                <li>Interrupciones temporales del servicio</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Terminación
              </h2>
              <p className="text-gray-700 mb-4">
                Podemos suspender o terminar tu cuenta si violas estos términos. Puedes cerrar tu cuenta en cualquier momento desde la configuración de tu perfil.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Modificaciones
              </h2>
              <p className="text-gray-700 mb-4">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Te notificaremos sobre cambios importantes y tu uso continuado constituirá aceptación de los nuevos términos.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Contacto
              </h2>
              <p className="text-gray-700 mb-4">
                Para preguntas sobre estos términos, contáctanos en:
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> legal@clipers.com<br />
                <strong>Dirección:</strong> [Dirección de la empresa]
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
