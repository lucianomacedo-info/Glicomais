import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "./screens/Login";
import Cadastro from "./screens/Cadastro";
import Home from "./screens/Home";
import { isLogado } from "./Controller/index";

const Stack = createNativeStackNavigator();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [logado, setLogadoState] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const status = await isLogado();
      setLogadoState(status);
      setLoading(false);
    };
    checkLogin();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={logado ? "Home" : "Login"}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
