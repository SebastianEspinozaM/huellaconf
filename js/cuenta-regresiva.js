// Cuenta regresiva al evento
const FECHA_EVENTO = new Date("2026-11-14T09:00:00-03:00");

// Función pura: calcula días, horas y minutos restantes
export function calcularTiempoRestante(desde, hasta = FECHA_EVENTO) {
  const diferencia = Math.max(hasta - desde, 0);
  return {
    dias: Math.floor(diferencia / 86400000),
    horas: Math.floor((diferencia / 3600000) % 24),
    minutos: Math.floor((diferencia / 60000) % 60),
  };
}

export function iniciarCuentaRegresiva() {
  const dias = document.getElementById("cdDias");
  const horas = document.getElementById("cdHoras");
  const minutos = document.getElementById("cdMinutos");
  if (!dias) return;

  const actualizar = () => {
    const tiempo = calcularTiempoRestante(new Date());
    dias.textContent = tiempo.dias;
    horas.textContent = tiempo.horas;
    minutos.textContent = tiempo.minutos;
  };

  actualizar();
  setInterval(actualizar, 30000);
}
