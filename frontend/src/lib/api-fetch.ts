export type ApiEnvelope<T> = {
  message?: string;
  data?: T;
  error?: string;
};

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
): Promise<ApiEnvelope<T>> {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const text = await response.text();
  let json: ApiEnvelope<T>;
  try {
    json = text ? (JSON.parse(text) as ApiEnvelope<T>) : {};
  } catch {
    throw new Error(
      response.ok
        ? "Invalid JSON from server"
        : `Request failed (${response.status})`,
    );
  }

  if (!response.ok) {
    throw new Error(json.message ?? json.error ?? "Request failed");
  }

  return json;
}
