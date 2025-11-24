import { useNavigate, useSearchParams } from 'react-router-dom';
import './PagoStyles.css';

export default function PagoFailure() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');

  return (
    <div className="pago-container">
      <div className="pago-card failure">
        <div className="icon">❌</div>
        <h1>Pago Rechazado</h1>
        <p className="main-message">
          Lo sentimos, tu pago no pudo ser procesado.
        </p>

        <div className="error-details">
          <h3>Posibles razones:</h3>
          <ul>
            <li>💳 Fondos insuficientes en la tarjeta</li>
            <li>🔒 La tarjeta fue rechazada por el banco</li>
            <li>📝 Datos de la tarjeta incorrectos</li>
            <li>🚫 Límite de compra excedido</li>
          </ul>
        </div>

        {paymentId && (
          <div className="payment-info">
            <p className="small-text">ID de transacción: {paymentId}</p>
            {status && <p className="small-text">Estado: {status}</p>}
          </div>
        )}

        <div className="recommendations">
          <h3>¿Qué puedes hacer?</h3>
          <ul>
            <li>✅ Verifica los datos de tu tarjeta</li>
            <li>✅ Contacta con tu banco</li>
            <li>✅ Intenta con otro método de pago</li>
            <li>✅ Intenta nuevamente más tarde</li>
          </ul>
        </div>

        <div className="action-buttons">
          <button onClick={() => navigate('/membresia')} className="btn-primary">
            Intentar Nuevamente
          </button>
          <button onClick={() => navigate('/')} className="btn-secondary">
            Volver al Inicio
          </button>
        </div>

        <div className="support-info">
          <p>¿Necesitas ayuda? Contáctanos:</p>
          <a href="mailto:soporte@clubegresados.com">soporte@clubegresados.com</a>
        </div>
      </div>
    </div>
  );
}
