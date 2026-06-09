// estilos isolados do SVG para não poluir o index.css global
export const ESTILOS_MAPA_BRASIL = `
  .mapa-brasil {
    width: 100%;
    max-width: 780px;
    margin: 0 auto;
  }

  .mapa-brasil__estado {
    cursor: pointer;
    stroke-width: 0.75;
    transition:
      fill 160ms ease,
      stroke 160ms ease,
      opacity 160ms ease;
    outline: none;
  }

  .mapa-brasil__estado:hover {
    opacity: 0.86;
    stroke-width: 1.6;
  }

  .mapa-brasil__estado--vazio {
    fill: #f8fafc;
    stroke: #cbd5e1;
  }

  .mapa-brasil__estado--alerta {
    fill: #fbbf24;
    stroke: #b45309;
  }

  .mapa-brasil__estado--registrado {
    fill: #3b82f6;
    stroke: #1d4ed8;
  }

  .mapa-brasil__estado--misto {
    fill: #10b981;
    stroke: #047857;
  }

  .mapa-brasil__estado--selecionado {
    stroke: #020617;
    stroke-width: 2.4;
  }

  .mapa-brasil__estado--desabilitado {
    fill: #e2e8f0;
    stroke: #cbd5e1;
    opacity: 0.25;
    cursor: not-allowed;
  }
`;