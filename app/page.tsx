'use client';

import { useState, type CSSProperties, type FormEvent } from 'react';

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

  // Evita que una respuesta antigua aparezca después de cambiar los datos.
  const [requestVersion, setRequestVersion] = useState(0);

  function clearPreviousResult() {
    setResult(null);
    setError('');
    setRequestVersion((version) => version + 1);
  }

  async function analyze(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError('');
    setResult(null);
    setBusy(true);

    const currentVersion = requestVersion;

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item: item.trim(),
          price: Number(price),
          budget: Number(budget),
          need: need.trim(),
          wait: Number(wait),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'No se pudo analizar la compra');
      }

      // La respuesta solo se muestra si corresponde a los datos enviados.
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error inesperado'
      );
    } finally {
      setBusy(false);
    }
  }

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
      {result && (
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
