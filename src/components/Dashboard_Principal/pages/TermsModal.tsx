import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";

const TermsModal = () => {
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  const handleAccept = () => {
    localStorage.setItem("termsAccepted", "true");
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const accepted = localStorage.getItem("termsAccepted");
    if (accepted === "true") {
      setVisible(false);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="bg-white max-h-[90vh] overflow-y-auto rounded-2xl shadow-lg w-full max-w-3xl p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center text-orange-600">Términos y Condiciones</h2>

        <section>
          <h3 className="font-semibold text-lg mb-2">✅ Navegadores Compatibles</h3>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li><strong>Google Chrome</strong> 92+ (óptimo: 124)</li>
            <li><strong>Mozilla Firefox</strong> 91+ (óptimo: 124-125)</li>
            <li><strong>Microsoft Edge (Chromium)</strong> 92+ (óptimo)</li>
            <li><strong>Safari</strong> (macOS 15+, iOS 15+)</li>
            <li><strong>Opera</strong> 78+ (óptimo)</li>
          </ul>
          <p className="text-xs mt-2">
            ⚠️ No se recomienda usar Internet Explorer. Brave y Vivaldi son compatibles al estar basados en Chromium.
          </p>
        </section>

        <section>
          <h3 className="font-semibold text-lg mt-4 mb-2">📋 Políticas de Uso</h3>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Registro con datos válidos y autenticación con token.</li>
            <li>Gestión de proyectos solo por el creador o administradores.</li>
            <li>Los colaboradores respetan los permisos asignados.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-lg mt-4 mb-2">👤 Conductas del Usuario</h3>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Prohibido el uso para spam, contenido ilegal u ofensivo.</li>
            <li>No compartir datos confidenciales de terceros.</li>
            <li>No sabotear proyectos ajenos.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-lg mt-4 mb-2">🔒 Seguridad y Privacidad</h3>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Contraseñas cifradas y uso de JWT.</li>
            <li>Informar vulnerabilidades o accesos no autorizados.</li>
            <li>No se recopila información innecesaria.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-lg mt-4 mb-2">⚠️ Limitaciones de Responsabilidad</h3>
          <p className="text-sm">TaskMate no se hace responsable por pérdidas de datos causadas por mal uso o errores externos. No incluye recordatorios automáticos.</p>
        </section>

        <section>
          <h3 className="font-semibold text-lg mt-4 mb-2">🛠 Cambios a las Políticas</h3>
          <p className="text-sm">Las políticas pueden cambiar y se notificará a los usuarios sobre cambios importantes.</p>
        </section>

        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={handleDecline}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-xl"
          >
            No aceptar
          </button>
          <button
            onClick={handleAccept}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl"
          >
            Aceptar y continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
