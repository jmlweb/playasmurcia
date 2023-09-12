const formatter = new Intl.NumberFormat('es-ES', {
  maximumFractionDigits: 1,
});

export const localizeNumber = formatter.format;
