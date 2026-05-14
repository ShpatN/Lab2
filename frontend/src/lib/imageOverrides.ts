const VENUE_IMAGES_KEY = "pn_venue_images";
const EVENT_IMAGES_KEY = "pn_event_images";

type ImageMap = Record<string, string>;

function readMap(key: string): ImageMap {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    return JSON.parse(raw) as ImageMap;
  } catch {
    return {};
  }
}

function writeMap(key: string, map: ImageMap): void {
  try {
    localStorage.setItem(key, JSON.stringify(map));
  } catch {
    // ignore storage errors
  }
}

export function getVenueImageOverride(id: string | number): string | null {
  const map = readMap(VENUE_IMAGES_KEY);
  return map[String(id)] ?? null;
}

export function setVenueImageOverride(id: string | number, imageUrl: string): void {
  const map = readMap(VENUE_IMAGES_KEY);
  map[String(id)] = imageUrl;
  writeMap(VENUE_IMAGES_KEY, map);
}

export function getEventImageOverride(id: string | number): string | null {
  const map = readMap(EVENT_IMAGES_KEY);
  return map[String(id)] ?? null;
}

export function setEventImageOverride(id: string | number, imageUrl: string): void {
  const map = readMap(EVENT_IMAGES_KEY);
  map[String(id)] = imageUrl;
  writeMap(EVENT_IMAGES_KEY, map);
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Failed to read selected file."));
    reader.readAsDataURL(file);
  });
}
