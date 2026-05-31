import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import MaskInput from "react-native-mask-input";
import { salvarUsuario, pegarUsuario } from "./../Controller/index";

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [peso, setPeso] = useState("");
  const [telefone, setTelefone] = useState("");
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    carregarUsuario();
  }, []);

  const carregarUsuario = async () => {
    const usuario = await pegarUsuario();

    if (usuario) {
      setEditando(true);
      setNome(usuario.nome || "");
      setEmail(usuario.email || "");
      setSenha(usuario.senha || "");
      setDataNascimento(usuario.dataNascimento || "");
      setPeso(String(usuario.peso || ""));
      setTelefone(usuario.telefone || "");
    }
  };

  const validarData = (data) => {
    const [dia, mes, ano] = data.split("/").map(Number);

    if (!dia || !mes || !ano) return false;
    if (dia < 1 || dia > 31) return false;
    if (mes < 1 || mes > 12) return false;
    if (ano < 1900 || ano > new Date().getFullYear()) return false;

    return true;
  };

  const validar = () => {
    if (!nome || !email || !senha || !dataNascimento || !peso || !telefone) {
      Alert.alert("Erro", "Preencha todos os campos");
      return false;
    }

    if (!email.includes("@")) {
      Alert.alert("Erro", "Email inválido");
      return false;
    }

    if (senha.length < 4) {
      Alert.alert("Erro", "Senha deve ter pelo menos 4 caracteres");
      return false;
    }

    if (!validarData(dataNascimento)) {
      Alert.alert("Erro", "Data inválida");
      return false;
    }

    if (isNaN(peso)) {
      Alert.alert("Erro", "Peso deve ser numérico");
      return false;
    }

    const telefoneNumerico = telefone.replace(/\D/g, "");
    if (telefoneNumerico.length < 10 || telefoneNumerico.length > 11) {
      Alert.alert("Erro", "Telefone inválido");
      return false;
    }

    return true;
  };

  const salvar = async () => {
    if (!validar()) return;

    const usuario = {
      nome,
      email,
      senha,
      dataNascimento,
      peso,
      telefone,
    };

    await salvarUsuario(usuario);

    Alert.alert(
      "Sucesso",
      editando ? "Dados atualizados!" : "Cadastro realizado!",
    );

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {editando ? "Meu Perfil" : "Criar conta"}
      </Text>

      <TextInput
        placeholder="Nome"
        placeholderTextColor="#999"
        style={styles.input}
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Senha"
        placeholderTextColor="#999"
        secureTextEntry
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
      />

      <MaskInput
        value={dataNascimento}
        onChangeText={(masked) => setDataNascimento(masked)}
        mask={[/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/]}
        placeholder="Data de nascimento (DD/MM/AAAA)"
        placeholderTextColor="#999"
        style={styles.input}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Peso (kg)"
        placeholderTextColor="#999"
        style={styles.input}
        keyboardType="numeric"
        value={peso}
        onChangeText={setPeso}
      />

      <MaskInput
        value={telefone}
        onChangeText={(masked) => setTelefone(masked)}
        mask={[
          "(",
          /\d/,
          /\d/,
          ")",
          " ",
          /\d/,
          /\d/,
          /\d/,
          /\d/,
          /\d/,
          "-",
          /\d/,
          /\d/,
          /\d/,
          /\d/,
        ]}
        placeholder="Telefone (11) 99999-9999"
        placeholderTextColor="#999"
        keyboardType="phone-pad"
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={salvar}>
        <Text style={styles.buttonText}>
          {editando ? "Salvar alterações" : "Cadastrar"}
        </Text>
      </Pressable>

      <Pressable onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Voltar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#1e293b",
    padding: 14,
    borderRadius: 10,
    color: "#fff",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#22c55e",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    width: "100%",
    textAlign: "center",
  },
  link: {
    color: "#38bdf8",
    textAlign: "center",
    marginTop: 20,
  },
});
