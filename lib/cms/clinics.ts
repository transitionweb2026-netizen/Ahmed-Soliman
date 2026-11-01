/**
 * The clinics, read from the contact settings. Each line of the address is
 * either a clinic, written "Clinic name: address", or — when at least one
 * clinic is written that way — a general line shown before them (e.g. the
 * areas served). The working-hours lines belong to the clinics, in order.
 */
export type Clinic = { name: string; address: string; hours: string };

const lines = (text: string) =>
  text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

const CLINIC_LINE = /^([^:：]{1,80})[:：]\s*(.+)$/;

/**
 * `areas`: general lines shown before the clinics. `hoursText` is left over
 * when the hours cannot be matched line by line to the clinics (different
 * number of lines): it is then shown on its own.
 */
export function clinicsOf(address: string, hours: string): { areas: string[]; clinics: Clinic[]; hoursText: string } {
  const addresses = lines(address);
  const schedules = lines(hours);
  const named = addresses.some((line) => CLINIC_LINE.test(line));
  // Without any "Name: address" line, every line is a clinic (a single plain address keeps working).
  const areas = named ? addresses.filter((line) => !CLINIC_LINE.test(line)) : [];
  const clinicLines = named ? addresses.filter((line) => CLINIC_LINE.test(line)) : addresses;
  const paired = clinicLines.length > 0 && clinicLines.length === schedules.length;
  const clinics = clinicLines.map((line, i) => {
    const match = line.match(CLINIC_LINE);
    return {
      name: match ? match[1].trim() : "",
      address: match ? match[2].trim() : line,
      hours: paired ? schedules[i] : "",
    };
  });
  return { areas, clinics, hoursText: paired ? "" : schedules.join("\n") };
}

/** Google Maps search for a clinic's address. */
export function mapsSearchUrl(clinic: Clinic): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.address)}`;
}
