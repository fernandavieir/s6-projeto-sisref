
export const TOKEN_KEY = "@rucedro-Token";
export const NAME_USER = "@rucedro-name-user";
export const LEVEL_USER = "@rucedro-acess-level-user";
export const ID_CAMPUS = "@rucedro-campus-user";
export const ACTIVE_USER = "@rucedro-active-user";
export const ID_USER = "@rucedro-id-user"

export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const loginToken = (token,name,classfication, active, campus, id) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(NAME_USER, name);
  localStorage.setItem(LEVEL_USER, classfication);
  localStorage.setItem(ID_CAMPUS, campus);
  localStorage.setItem(ACTIVE_USER, active);
  localStorage.setItem(ID_USER, id);
};
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(NAME_USER);
  localStorage.removeItem(LEVEL_USER);
  localStorage.removeItem(ID_CAMPUS);
  localStorage.removeItem(ACTIVE_USER);
  localStorage.removeItem(ID_USER);
};
