import { useNavigate, useSearchParams } from 'react-router-dom';
import './PagoStyles.css';

export default function PagoPending() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const paymentId = searchParams.get('payment_id');
  const externalReference = searchParams.get('external_reference');

  return (
    <div className="pago-container">
      <div className="pago-card pending">
        <div className="icon">⏳</div>
        <h1>Pago Pendiente</h1>
        <p className="main-message">
          Tu pago está siendo procesado
        </p>

        <div className="pending-info">
          <p>
            Hemos recibido tu solicitud de pago, pero aún está siendo verificada 
            por Mercado Pago o tu entidad bancaria.
          </p>
        </div>

        {paymentId && (
          <div className="payment-info">
            <div className="info-box">
              <h3>Información del pago:</h3>
              <p><strong>ID de transacción:</strong></p>
              <p className="code">{paymentId}</p>
              <p className="small-text">Guarda este código para futuras consultas</p>
            </div>
          </div>
        )}

        <div className="timeline">
          <h3>¿Qué sucede ahora?</h3>
          <div className="timeline-item">
            <span className="step">1</span>
            <div className="content">
              <h4>Verificación en proceso</h4>
              <p>Tu banco o Mercado Pago están verificando la transacción</p>
            </div>
          </div>
          <div className="timeline-item">
            <span className="step">2</span>
            <div className="content">
              <h4>Notificación</h4>
              <p>Recibirás un correo cuando el pago sea confirmado</p>
            </div>
          </div>
          <div className="timeline-item">
            <span className="step">3</span>
            <div className="content">
              <h4>Activación automática</h4>
              <p>Tu membresía se activará automáticamente al confirmar el pago</p>
            </div>
          </div>
        </div>

        <div className="time-estimate">
          <h3>⏱️ Tiempo estimado:</h3>
          <p>La confirmación puede tomar entre <strong>5 minutos hasta 48 horas</strong>, 
          dependiendo del método de pago utilizado.</p>
        </div>

        <div className="payment-methods-info">
          <h3>Según tu método de pago:</h3>
          <ul>
            <li>💳 <strong>Tarjeta de crédito/débito:</strong> 5-15 minutos</li>
            <li>🏦 <strong>Transferencia bancaria:</strong> 1-2 días hábiles</li>
            <li>💰 <strong>Efectivo:</strong> Hasta 48 horas</li>
          </ul>
        </div>

        <div className="action-buttons">
          <button onClick={() => navigate('/membresia')} className="btn-primary">
            Ver Estado de Membresía
          </button>
          <button onClick={() => navigate('/')} className="btn-secondary">
            Volver al Inicio
          </button>
        </div>

        <div className="support-info">
          <p><strong>¿Tienes dudas?</strong></p>
          <p>Puedes consultar el estado de tu pago en:</p>
          <ul>
            <li>📧 Tu correo electrónico (revisa spam/promociones)</li>
            <li>📱 La app de Mercado Pago</li>
            <li>💬 Nuestro soporte: <a href="mailto:soporte@clubegresados.com">soporte@clubegresados.com</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
