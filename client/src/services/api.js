export async function apiGet(path) {
  const response = await fetch(`/api${path}`);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}
