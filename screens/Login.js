import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Pressable,
  Image,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { pegarUsuario, setLogado } from "./../Controller/index";

export default function Login() {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const logar = async () => {
    const usuarioSalvo = await pegarUsuario();

    if (
      usuarioSalvo &&
      usuarioSalvo.email === email &&
      usuarioSalvo.senha === senha
    ) {
      await setLogado(true);

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } else {
      Alert.alert("Erro", "Usuário ou senha inválidos");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo.png")}
        style={{ width: 150, height: 150 }}
      />
      <Text style={styles.title}>Bem-vindo</Text>
      <Text style={styles.subtitle}>Faça login para continuar</Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        style={styles.input}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Senha"
        placeholderTextColor="#999"
        secureTextEntry
        style={styles.input}
        onChangeText={setSenha}
      />
      <Pressable style={styles.button} onPress={logar}>
        <Text style={styles.buttonText}>Entrar</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate("Cadastro")}>
        <Text style={styles.link}>Criar conta</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#94a3b8",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#1e293b",
    padding: 15,
    borderRadius: 10,
    color: "#fff",
    marginBottom: 15,
    width: "100%",
  },
  button: {
    backgroundColor: "#22c55e",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    width: "50%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: "#38bdf8",
    textAlign: "center",
    marginTop: 20,
  },
});
