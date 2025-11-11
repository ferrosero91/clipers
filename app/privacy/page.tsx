import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Política de Privacidad - Clipers",
  description: "Política de privacidad de la plataforma Clipers",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Política de Privacidad
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Fecha de última actualización:</strong> {new Date().toLocaleDateString('es-ES')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Información que Recopilamos
              </h2>
              <p className="text-gray-700 mb-4">
                En Clipers, recopilamos información que nos proporcionas directamente cuando:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Creas una cuenta en nuestra plataforma</li>
                <li>Completas tu perfil profesional</li>
                <li>Publicas ofertas de trabajo o servicios</li>
                <li>Interactúas con otros usuarios</li>
                <li>Nos contactas para soporte técnico</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Cómo Utilizamos tu Información
              </h2>
              <p className="text-gray-700 mb-4">
                Utilizamos la información recopilada para:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Proporcionar y mejorar nuestros servicios</li>
                <li>Facilitar conexiones entre profesionales y empleadores</li>
                <li>Personalizar tu experiencia en la plataforma</li>
                <li>Comunicarnos contigo sobre actualizaciones y oportunidades</li>
                <li>Garantizar la seguridad de la plataforma</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Compartir Información
              </h2>
              <p className="text-gray-700 mb-4">
                No vendemos, intercambiamos ni transferimos tu información personal a terceros sin tu consentimiento, excepto cuando:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Es necesario para proporcionar nuestros servicios</li>
                <li>Lo requiere la ley o autoridades competentes</li>
                <li>Es necesario para proteger nuestros derechos o seguridad</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Seguridad de los Datos
              </h2>
              <p className="text-gray-700 mb-4">
                Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger tu información personal contra acceso no autorizado, alteración, divulgación o destrucción.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Tus Derechos
              </h2>
              <p className="text-gray-700 mb-4">
                Tienes derecho a:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Acceder a tu información personal</li>
                <li>Corregir datos inexactos</li>
                <li>Solicitar la eliminación de tus datos</li>
                <li>Limitar el procesamiento de tu información</li>
                <li>Portabilidad de tus datos</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Contacto
              </h2>
              <p className="text-gray-700 mb-4">
                Si tienes preguntas sobre esta política de privacidad, puedes contactarnos en:
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> privacy@clipers.com<br />
                <strong>Dirección:</strong> [Dirección de la empresa]
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
