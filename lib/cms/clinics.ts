/**
 * The clinics, read from the contact settings: each line of the address is
 * one clinic, written "Clinic name: address", and the line with the same
 * number in the working hours is that clinic's schedule.
 */
export type Clinic = { name: string; address: string; hours: string };

const lines = (text: string) =>
  text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

/**
 * `hoursText` is left over when the hours cannot be matched line by line to
 * the clinics (different number of lines): it is then shown on its own.
 */
export function clinicsOf(address: string, hours: string): { clinics: Clinic[]; hoursText: string } {
  const addresses = lines(address);
  const schedules = lines(hours);
  const paired = addresses.length > 0 && addresses.length === schedules.length;
  const clinics = addresses.map((line, i) => {
    const match = line.match(/^([^:：]{1,80})[:：]\s*(.+)$/);
    return {
      name: match ? match[1].trim() : "",
      address: match ? match[2].trim() : line,
      hours: paired ? schedules[i] : "",
    };
  });
  return { clinics, hoursText: paired ? "" : schedules.join("\n") };
}

/** Google Maps search for a clinic's address. */
export function mapsSearchUrl(clinic: Clinic): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.address)}`;
}
