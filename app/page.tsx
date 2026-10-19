'use client';

import { useRef, useState, type CSSProperties, type FormEvent } from 'react';

type Result = {
  decision: string;
  reason: string;
  questions: string[];
  nextStep: string;
  source: string;
};

export default function Home() {
  const [item, setItem] = useState('');
  const [price, setPrice] = useState('');
  const [budget, setBudget] = useState('');
  const [need, setNeed] = useState('');
  const [wait, setWait] = useState('24');

  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Identifica cada solicitud para evitar mostrar respuestas anteriores.
  const requestVersion = useRef(0);

  // Guarda los datos utilizados en el análisis mostrado.
  const [analyzedAmounts, setAnalyzedAmounts] = useState<{
    price: number;
    budget: number;
  } | null>(null);

  function clearPreviousResult() {
    requestVersion.current += 1;
    setResult(null);
    setAnalyzedAmounts(null);
    setError('');
    setBusy(false);
  }

  async function analyze(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const currentVersion = ++requestVersion.current;
    const currentPrice = Number(price);
    const currentBudget = Number(budget);

    setError('');
    setResult(null);
    setAnalyzedAmounts(null);
    setBusy(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item: item.trim(),
          price: currentPrice,
          budget: currentBudget,
          need: need.trim(),
          wait: Number(wait),
        }),
      });

      const data = await response.json();

      // Ignora respuestas que ya no corresponden al formulario actual.
      if (currentVersion !== requestVersion.current) {
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'No se pudo analizar la compra');
      }

      setResult(data);
      setAnalyzedAmounts({
        price: currentPrice,
        budget: currentBudget,
      });
    } catch (err) {
      if (currentVersion !== requestVersion.current) {
        return;
      }

      setError(
        err instanceof Error ? err.message : 'Error inesperado'
      );
    } finally {
      if (currentVersion === requestVersion.current) {
        setBusy(false);
      }
    }
  }

  // Formato de moneda mexicana.
  function formatMoney(amount: number) {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  }

  // Mejora propuesta a partir del Persona Test simulado de Valeria.
  const budgetDifference = analyzedAmounts
    ? analyzedAmounts.price - analyzedAmounts.budget
    : 0;

  const field: CSSProperties = {
    display: 'block',
    width: '100%',
    boxSizing: 'border-box',
    border: '1px solid #cad5dd',
    borderRadius: 12,
    padding: 13,
    marginTop: 6,
    fontSize: 16,
    background: '#ffffff',
    color: '#172b3a',
  };

  const label: CSSProperties = {
    display: 'block',
    marginTop: 16,
    fontSize: 16,
    fontWeight: 500,
  };

  return (
    <main
      style={{
        maxWidth: 700,
        margin: '0 auto',
        padding: '36px 18px',
        color: '#172b3a',
      }}
    >
      {/* ENCABEZADO */}
      <header
        style={{
          background: '#163c4d',
          color: 'white',
          padding: 28,
          borderRadius: 20,
        }}
      >
        <div
          style={{
            fontSize: 13,
            letterSpacing: 3,
            color: '#a6e6d5',
          }}
        >
          PAUSA MX
        </div>

        <h1 style={{ marginBottom: 8 }}>
          ¿Lo compro o espero?
        </h1>

        <p style={{ lineHeight: 1.5, marginBottom: 0 }}>
          Tu dinero, tus reglas. No vendemos productos ni cobramos
          comisiones.
        </p>
      </header>

      {/* FORMULARIO */}
      <section
        style={{
          background: 'white',
          padding: 26,
          borderRadius: 20,
          marginTop: 18,
          boxShadow: '0 8px 30px #2030440b',
        }}
      >
        <h2>Revisa tu compra en 1 minuto</h2>

        <form onSubmit={analyze}>
          <label style={label}>
            ¿Qué quieres comprar?

            <input
              style={field}
              maxLength={80}
              required
              value={item}
              onChange={(e) => {
                setItem(e.target.value);
                clearPreviousResult();
              }}
              placeholder="Ej. tenis nuevos"
            />
          </label>

          <label style={label}>
            Precio en pesos mexicanos

            <input
              style={field}
              type="number"
              min="1"
              max="10000000"
              step="0.01"
              required
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                clearPreviousResult();
              }}
              placeholder="Ej. 2500"
            />
          </label>

          <label style={label}>
            Dinero disponible para compras no esenciales este mes

            <input
              style={field}
              type="number"
              min="0"
              max="10000000"
              step="0.01"
              required
              value={budget}
              onChange={(e) => {
                setBudget(e.target.value);
                clearPreviousResult();
              }}
              placeholder="Ej. 3000"
            />
          </label>

          <label style={label}>
            ¿Para qué lo necesitas?

            <textarea
              style={field}
              maxLength={400}
              required
              rows={3}
              value={need}
              onChange={(e) => {
                setNeed(e.target.value);
                clearPreviousResult();
              }}
              placeholder="Explica en tus palabras"
            />
          </label>

          <label style={label}>
            ¿Cuánto puedes esperar?

            <select
              style={field}
              value={wait}
              onChange={(e) => {
                setWait(e.target.value);
                clearPreviousResult();
              }}
            >
              <option value="0">Lo necesito hoy</option>
              <option value="24">24 horas</option>
              <option value="72">3 días</option>
              <option value="168">7 días</option>
            </select>
          </label>

          <button
            type="submit"
            disabled={busy}
            style={{
              width: '100%',
              background: busy ? '#86aaa5' : '#147d73',
              color: 'white',
              border: 0,
              padding: 16,
              borderRadius: 12,
              marginTop: 22,
              fontSize: 17,
              cursor: busy ? 'wait' : 'pointer',
            }}
          >
            {busy ? 'Analizando tu compra...' : 'Ayúdame a decidir'}
          </button>
        </form>
      </section>

      {/* MENSAJE DE ERROR */}
      {error && (
        <section
          role="alert"
          style={{
            background: '#fff1f0',
            border: '1px solid #e7a29c',
            padding: 20,
            borderRadius: 16,
            marginTop: 18,
          }}
        >
          <strong>No pudimos analizar tu compra.</strong>
          <p>{error}</p>
        </section>
      )}

      {/* RESULTADO */}
      {result && analyzedAmounts && (
        <section
          aria-live="polite"
          style={{
            background: '#e5f4ef',
            border: '2px solid #77c1a8',
            padding: 26,
            borderRadius: 20,
            marginTop: 18,
          }}
        >
          <p style={{ fontSize: 13 }}>
            {result.source === 'ai'
              ? 'ANÁLISIS CON IA'
              : 'REGLAS DE RESPALDO · SIN IA'}
          </p>

          <h2 style={{ fontSize: 26 }}>
            {result.decision}
          </h2>

          <p>{result.reason}</p>

          {/* MEJORA DEL PERSONA TEST */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #77c1a8',
              borderRadius: 12,
              padding: 18,
              marginTop: 18,
              marginBottom: 18,
            }}
          >
            <h3 style={{ marginTop: 0 }}>
              Tu presupuesto en números
            </h3>

            <p>
              <strong>Precio de la compra:</strong>{' '}
              {formatMoney(analyzedAmounts.price)}
            </p>

            <p>
              <strong>Presupuesto disponible:</strong>{' '}
              {formatMoney(analyzedAmounts.budget)}
            </p>

            {budgetDifference > 0 ? (
              <p
                style={{
                  color: '#b42318',
                  fontWeight: 700,
                  lineHeight: 1.6,
                }}
              >
                Esta compra supera tu presupuesto por{' '}
                {formatMoney(budgetDifference)}.
              </p>
            ) : (
              <p
                style={{
                  color: '#147d73',
                  fontWeight: 700,
                  lineHeight: 1.6,
                }}
              >
                Esta compra está dentro de tu presupuesto.
                Te quedarían{' '}
                {formatMoney(Math.abs(budgetDifference))}.
              </p>
            )}
          </div>

          <h3>Antes de decidir, pregúntate:</h3>

          <ol style={{ lineHeight: 1.9 }}>
            {result.questions.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ol>

          <p>
            <strong>Siguiente paso: </strong>
            {result.nextStep}
          </p>

          <p style={{ fontSize: 13 }}>
            Esta herramienta orienta; tú decides. No es asesoría
            financiera. No guardamos tus respuestas.
          </p>
        </section>
      )}

      {/* PRIVACIDAD */}
      <footer
        style={{
          textAlign: 'center',
          marginTop: 28,
          fontSize: 13,
          color: '#526779',
        }}
      >
        Privacidad: sin cuentas, sin seguimiento, sin historial de compras.
      </footer>
    </main>
  );
}
