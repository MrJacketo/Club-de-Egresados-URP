import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyPaymentRequest } from '../../api/pagoApi';
import './PagoStyles.css';

export default function PagoSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verificarPago = async () => {
      const paymentId = searchParams.get('payment_id');
      const externalReference = searchParams.get('external_reference');
      
      if (!paymentId) {
        setError('No se encontró información del pago');
        setLoading(false);
        return;
      }

      try {
        const result = await verifyPaymentRequest(paymentId, externalReference);
        setPaymentStatus(result);
      } catch (error) {
        console.error('Error al verificar pago:', error);
        setError('Error al verificar el estado del pago');
      } finally {
        setLoading(false);
      }
    };

    verificarPago();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="pago-container">
        <div className="pago-card loading">
          <div className="spinner"></div>
          <h2>Verificando tu pago...</h2>
          <p>Por favor espera un momento</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pago-container">
        <div className="pago-card error">
          <div className="icon">⚠️</div>
          <h1>Error</h1>
          <p>{error}</p>
          <button onClick={() => navigate('/membresia')} className="btn-primary">
            Volver a Membresía
          </button>
        </div>
      </div>
    );
  }

  if (paymentStatus?.success) {
    return (
      <div className="pago-container">
        <div className="pago-card success">
          <div className="icon">✅</div>
          <h1>¡Pago Exitoso!</h1>
          <p className="main-message">Tu membresía ha sido activada correctamente</p>
          
          <div className="payment-details">
            <div className="detail-item">
              <span className="label">Estado:</span>
              <span className="value success-badge">Activa</span>
            </div>
            <div className="detail-item">
              <span className="label">Fecha de activación:</span>
              <span className="value">
                {new Date(paymentStatus.membresia.fechaActivacion).toLocaleDateString('es-PE')}
              </span>
            </div>
            <div className="detail-item">
              <span className="label">Válida hasta:</span>
              <span className="value">
                {new Date(paymentStatus.membresia.fechaVencimiento).toLocaleDateString('es-PE')}
              </span>
            </div>
            <div className="detail-item">
              <span className="label">ID de transacción:</span>
              <span className="value small">{paymentStatus.membresia.mercadoPagoPaymentId}</span>
            </div>
          </div>

          <div className="benefits-info">
            <h3>🎉 Ya puedes disfrutar de todos los beneficios:</h3>
            <ul>
              <li>✨ Acceso a conferencias exclusivas</li>
              <li>💼 Ofertas laborales prioritarias</li>
              <li>🎁 Descuentos y beneficios especiales</li>
              <li>🤝 Red de contactos profesionales</li>
            </ul>
          </div>

          <div className="action-buttons">
            <button onClick={() => navigate('/membresia')} className="btn-primary">
              Ver mi Membresía
            </button>
            <button onClick={() => navigate('/beneficios')} className="btn-secondary">
              Explorar Beneficios
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pago-container">
      <div className="pago-card warning">
        <div className="icon">ℹ️</div>
        <h1>Pago No Completado</h1>
        <p>Estado: {paymentStatus?.status || 'Desconocido'}</p>
        <p>Tu pago no pudo ser procesado correctamente.</p>
        <button onClick={() => navigate('/membresia')} className="btn-primary">
          Intentar Nuevamente
        </button>
      </div>
    </div>
  );
}
