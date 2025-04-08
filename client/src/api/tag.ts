export const getTags = async (search: string, token: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/tag?search=${search}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const json = await response.json();
  if (!response.ok) {
    throw Error(json.error);
  }
  return json;
};
export const addTag = async (tagname: string, token: string) => {
  const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/tag`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ tagname }),
  });
  const json = await response.json();
  if (!response.ok) {
    throw Error(json.error);
  }
  return json;
};
