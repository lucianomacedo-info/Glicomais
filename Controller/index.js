import AsyncStorage from "@react-native-async-storage/async-storage";

export const salvarUsuario = async (usuario) => {
  await AsyncStorage.setItem("usuario", JSON.stringify(usuario));
};

export const pegarUsuario = async () => {
  const data = await AsyncStorage.getItem("usuario");
  return data ? JSON.parse(data) : null;
};

export const setLogado = async (valor) => {
  await AsyncStorage.setItem("logado", JSON.stringify(valor));
};

export const isLogado = async () => {
  const data = await AsyncStorage.getItem("logado");
  return data ? JSON.parse(data) : false;
};

export const logout = async () => {
  await AsyncStorage.removeItem("logado");
};
