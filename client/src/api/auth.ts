import { SignInType, SignUpType } from "../lib/types";

export const signUp = async (data: SignUpType) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/auth/signup`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );
  const json = await response.json();
  if (!response.ok) {
    throw Error(json.error);
  }

  return json;
};

export const signIn = async (data: SignInType) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/auth/signin`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    },
  );
  const json = await response.json();
  if (!response.ok) {
    throw Error(json.error);
  }
  return json;
};
export const verify = async (token: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/auth/verify`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const data = await response.json();

  if (!response.ok) {
    throw Error(data.error);
  }
  return data;
};
export const signOut = async (token: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/auth/signout`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    const data = await response.json();
    throw Error(data.error);
  }
};
export const toggleShare = async (restrict: boolean, token: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/api/auth/${restrict ? "restrict" : "share"}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = await response.json();
  console.log(data);
  if (!response.ok) {
    throw Error(data.error);
  }
  return data;
};
