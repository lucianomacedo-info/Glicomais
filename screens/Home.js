import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
const STORAGE_KEY = "@glicose_medicoes";

const colors = {
  bg: "#F4F8FB",
  card: "#FFFFFF",
  text: "#1F2937",
  sub: "#6B7280",
  primary: "#25365e",
  green: "#22C55E",
  yellow: "#F59E0B",
  red: "#EF4444",
  blue: "#38BDF8",
  border: "#E5E7EB",
};

const tipos = [
  "Jejum",
  "Pré café",
  "Pós café",
  "Pré almoço",
  "Pós almoço",
  "Pré lanche",
  "Pós lanche",
  "Pré jantar",
  "Pós jantar",
  "Dormir",
  "Madrugada",
  "Pré treino",
  "Pós treino",
  "Mal-estar",
  "Outro",
];

const dicas = [
  "Evite excesso de açúcar, doces e refrigerantes no dia a dia.",
  "Prefira refeições com fibras, verduras, legumes e alimentos naturais.",
  "Caminhadas regulares ajudam no controle da glicose.",
  "Beba água ao longo do dia para manter a hidratação.",
  "Não pule refeições se houver orientação médica para rotina fixa.",
  "Observe como sua glicose varia antes e depois das refeições.",
  "Tome seus medicamentos corretamente, conforme orientação médica.",
  "Evite longos períodos em jejum sem acompanhamento profissional.",
  "Dê preferência a carboidratos integrais em vez dos refinados.",
  "Reduza o consumo de frituras e alimentos ultraprocessados.",
  "Evite exageros alimentares, principalmente à noite.",
  "Dormir bem também ajuda no controle da glicemia.",
  "O estresse pode influenciar seus níveis de glicose.",
  "Manter horários regulares para comer pode ajudar no controle.",
  "Frutas podem fazer parte da alimentação, mas com equilíbrio.",
  "Procure mastigar devagar e comer com atenção.",
  "Evite bebidas açucaradas e sucos industrializados.",
  "O acompanhamento médico é importante para prevenir complicações.",
  "Controlar a glicose ajuda a proteger coração, rins e visão.",
  "A prática de atividade física deve respeitar seus limites.",
  "Antes de exercícios intensos, observe como está sua glicose.",
  "Se sentir tontura, tremor ou fraqueza, verifique a glicose se possível.",
  "Hipoglicemia pode causar suor frio, confusão, fome e tremores.",
  "Em caso de glicose muito baixa, siga a orientação do seu profissional de saúde.",
  "Manter um histórico das medições ajuda a entender sua rotina.",
  "Alimentação equilibrada não significa deixar de comer tudo, mas saber escolher melhor.",
  "Evite repetir grandes quantidades de arroz, massas, pães e doces na mesma refeição.",
  "Adicionar saladas e legumes ao prato pode ajudar no equilíbrio da refeição.",
  "Pequenas mudanças na rotina podem trazer bons resultados com o tempo.",
  "Não interrompa medicamentos por conta própria.",
  "Controlar o peso pode ajudar no controle do diabetes tipo 2.",
  "Verifique seus exames regularmente quando houver orientação médica.",
  "Evite automedicação sem orientação profissional.",
  "Ter uma rotina de sono adequada faz diferença para a saúde metabólica.",
  "O consumo exagerado de álcool pode prejudicar o controle glicêmico.",
  "Fumar também aumenta riscos para a saúde de quem tem diabetes.",
  "Procure cuidar da saúde dos pés, especialmente se você tem diabetes.",
  "Feridas que demoram a cicatrizar merecem atenção médica.",
  "Visão embaçada pode ser um sinal de glicose alterada em alguns casos.",
  "Controlar a pressão arterial também é importante para a saúde geral.",
  "Colesterol e glicose muitas vezes precisam ser acompanhados juntos.",
  "Faça suas medições sempre que orientado pelo seu médico ou nutricionista.",
  "Ter disciplina com a rotina pode facilitar muito o controle da glicose.",
  "Evite confiar apenas em sintomas: a medição ajuda a entender melhor o corpo.",
  "Nem sempre glicose alta causa sintomas imediatos, por isso o acompanhamento é importante.",
  "Lanches equilibrados podem ajudar a evitar grandes oscilações glicêmicas.",
  "Iogurte natural, castanhas e frutas podem ser opções melhores que doces industrializados.",
  "Leia rótulos de alimentos para observar a quantidade de açúcar.",
  "Produtos “fit” ou “diet” nem sempre significam melhor escolha; leia a composição.",
  "Comer bem é uma forma de autocuidado e prevenção.",
  "A constância é mais importante do que buscar perfeição.",
  "Cuidar da glicose é cuidar da sua energia, disposição e qualidade de vida.",
  "Anotar sintomas junto com a medição pode ajudar na avaliação da rotina.",
  "Se estiver doente, sua glicose pode variar mais do que o habitual.",
  "Mudanças no apetite, sede excessiva ou vontade frequente de urinar merecem atenção.",
  "Procure manter consultas e exames em dia.",
  "Seu tratamento deve ser individualizado conforme sua necessidade.",
  "Apoio da família pode ajudar muito na rotina de cuidados.",
  "Peça orientação profissional sempre que tiver dúvidas sobre alimentação ou medicação.",
  "Este aplicativo ajuda na organização pessoal, mas não substitui avaliação médica.",
];

function hojeData() {
  const d = new Date();
  return d.toLocaleDateString("pt-BR");
}

function agoraHora() {
  const d = new Date();
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function classificarGlicose(valor, tipo) {
  const v = Number(valor);

  if (isNaN(v) || v <= 0) {
    return {
      classificacao: "Inválido",
      cor: "#9CA3AF",
      aviso: "Informe um valor válido.",
    };
  }

  if (v < 70) {
    return {
      classificacao: "Hipoglicemia",
      cor: colors.blue,
      aviso: "Sua glicose está baixa. Se estiver passando mal, procure ajuda.",
    };
  }

  const ehJejum =
    tipo === "Jejum" ||
    tipo === "Antes do almoço" ||
    tipo === "Antes do jantar";

  if (ehJejum) {
    if (v <= 99) {
      return {
        classificacao: "Normal",
        cor: colors.green,
        aviso: "Sua glicose está dentro da faixa esperada.",
      };
    }
    if (v <= 125) {
      return {
        classificacao: "Pré-diabetes",
        cor: colors.yellow,
        aviso: "Sua glicose está acima do ideal. Vale acompanhar com atenção.",
      };
    }
    return {
      classificacao: "Diabetes",
      cor: colors.red,
      aviso: "Sua glicose está alta. É importante acompanhamento médico.",
    };
  }

  if (v <= 139) {
    return {
      classificacao: "Normal",
      cor: colors.green,
      aviso: "Sua glicose está dentro da faixa esperada.",
    };
  }
  if (v <= 199) {
    return {
      classificacao: "Pré-diabetes",
      cor: colors.yellow,
      aviso: "Sua glicose está acima do ideal. Observe sua rotina alimentar.",
    };
  }

  return {
    classificacao: "Diabetes",
    cor: colors.red,
    aviso: "Sua glicose está alta. É importante acompanhar com atenção.",
  };
}

function calcularMedia(lista) {
  if (!lista.length) return 0;
  const total = lista.reduce((acc, item) => acc + Number(item.valor || 0), 0);
  return Math.round(total / lista.length);
}

function Badge({ texto, cor }) {
  return (
    <View style={[styles.badge, { backgroundColor: cor }]}>
      <Text style={styles.badgeText}>{texto}</Text>
    </View>
  );
}

function CardResumo({ title, value, subtitle, icon }) {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryHeader} Acompanhe>
        <Text style={styles.summaryTitle}>{title}</Text>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summarySubtitle}>{subtitle}</Text>
    </View>
  );
}

export default function App() {
  const navigation = useNavigation();
  const [aba, setAba] = useState("home");
  const [medicoes, setMedicoes] = useState([]);
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("Jejum");
  const [data, setData] = useState(hojeData());
  const [hora, setHora] = useState(agoraHora());
  const [obs, setObs] = useState("");
  const [filtro, setFiltro] = useState("Todos");

  useEffect(() => {
    carregarMedicoes();
    configurarBarras();
  }, []);

  async function configurarBarras() {
    try {
      await NavigationBar.setPositionAsync("absolute");
      await NavigationBar.setBackgroundColorAsync("transparent");
      await NavigationBar.setButtonStyleAsync("dark");
      await NavigationBar.setBehaviorAsync("overlay-swipe");
      await NavigationBar.setVisibilityAsync("hidden");
    } catch (error) {
      console.log("Erro ao configurar NavigationBar:", error);
    }
  }

  async function carregarMedicoes() {
    try {
      const dados = await AsyncStorage.getItem(STORAGE_KEY);
      if (dados) {
        setMedicoes(JSON.parse(dados));
      }
    } catch (e) {
      console.log("Erro ao carregar", e);
    }
  }

  async function salvarNoStorage(lista) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    } catch (e) {
      console.log("Erro ao salvar", e);
    }
  }

  async function salvarMedicao() {
    if (!valor.trim()) {
      Alert.alert("Atenção", "Digite o valor da glicose.");
      return;
    }

    const resultado = classificarGlicose(valor, tipo);

    if (resultado.classificacao === "Inválido") {
      Alert.alert("Atenção", "Digite um valor válido.");
      return;
    }

    const nova = {
      id: Date.now().toString(),
      valor: Number(valor),
      tipo,
      data,
      hora,
      observacao: obs,
      classificacao: resultado.classificacao,
      cor: resultado.cor,
      aviso: resultado.aviso,
      criadoEm: new Date().toISOString(),
    };

    const novaLista = [nova, ...medicoes];
    setMedicoes(novaLista);
    await salvarNoStorage(novaLista);

    Alert.alert(
      "Medição salva",
      `${resultado.classificacao}\n\n${resultado.aviso}`,
    );

    setValor("");
    setTipo("Jejum");
    setData(hojeData());
    setHora(agoraHora());
    setObs("");
    setAba("historico");
  }

  async function excluirMedicao(id) {
    const novaLista = medicoes.filter((item) => item.id !== id);
    setMedicoes(novaLista);
    await salvarNoStorage(novaLista);
  }

  async function limparTudo() {
    Alert.alert("Limpar histórico", "Deseja apagar todas as medições?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Apagar",
        style: "destructive",
        onPress: async () => {
          setMedicoes([]);
          await AsyncStorage.removeItem(STORAGE_KEY);
        },
      },
    ]);
  }

  const ultima = medicoes[0];
  const media = useMemo(() => calcularMedia(medicoes), [medicoes]);
  const normais = medicoes.filter((i) => i.classificacao === "Normal").length;
  const pre = medicoes.filter((i) => i.classificacao === "Pré-diabetes").length;
  const diabetes = medicoes.filter(
    (i) => i.classificacao === "Diabetes",
  ).length;
  const hipo = medicoes.filter(
    (i) => i.classificacao === "Hipoglicemia",
  ).length;

  const medicoesFiltradas =
    filtro === "Todos"
      ? medicoes
      : medicoes.filter((item) => item.classificacao === filtro);

  function renderHome() {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerBox}>
          <View>
            <Text style={styles.title}>Controle de Glicose</Text>
            <Text style={styles.subtitle}>
              Acompanhe suas medições com mais facilidade.
            </Text>
          </View>
          <View style={styles.headerIconBox}>
            <Ionicons name="water" size={26} color={colors.primary} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Última medição</Text>
          {ultima ? (
            <>
              <Text style={styles.bigNumber}>{ultima.valor} mg/dL</Text>
              <Badge texto={ultima.classificacao} cor={ultima.cor} />
              <Text style={styles.infoText}>
                {ultima.tipo} • {ultima.data} às {ultima.hora}
              </Text>
              <Text style={styles.warningText}>{ultima.aviso}</Text>
            </>
          ) : (
            <Text style={styles.emptyText}>Nenhuma medição salva ainda.</Text>
          )}
        </View>

        <View style={styles.summaryRow}>
          <CardResumo
            title="Média"
            value={`${media || 0}`}
            subtitle="mg/dL"
            icon="analytics-outline"
          />
          <CardResumo
            title="Registros"
            value={`${medicoes.length}`}
            subtitle="medições"
            icon="document-text-outline"
          />
        </View>

        <View style={styles.summaryRow}>
          <CardResumo
            title="Normal"
            value={`${normais}`}
            subtitle="leituras"
            icon="checkmark-circle-outline"
          />
          <CardResumo
            title="Alta/Baixa"
            value={`${pre + diabetes + hipo}`}
            subtitle="atenção"
            icon="alert-circle-outline"
          />
        </View>
      </ScrollView>
    );
  }

  function renderNova() {
    const preview = classificarGlicose(valor || 0, tipo);

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Nova medição</Text>
        <Text style={styles.subtitle}>
          Cadastre sua glicose e receba um aviso automático.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Valor da glicose (mg/dL)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 98"
            keyboardType="numeric"
            value={valor}
            onChangeText={setValor}
          />

          <Text style={styles.label}>Tipo da medição</Text>
          <View style={styles.wrapRow}>
            {tipos.map((item) => (
              <Pressable
                key={item}
                style={[styles.chip, tipo === item && styles.chipActive]}
                onPress={() => setTipo(item)}
              >
                <Text
                  style={[
                    styles.chipText,
                    tipo === item && styles.chipTextActive,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Data</Text>
          <TextInput
            style={styles.input}
            value={data}
            onChangeText={setData}
            placeholder="01/04/2026"
          />

          <Text style={styles.label}>Hora</Text>
          <TextInput
            style={styles.input}
            value={hora}
            onChangeText={setHora}
            placeholder="08:30"
          />

          <Text style={styles.label}>Observação (opcional)</Text>
          <TextInput
            style={[styles.input, { height: 90, textAlignVertical: "top" }]}
            value={obs}
            onChangeText={setObs}
            placeholder="Ex: medi depois do almoço"
            multiline
          />
        </View>

        {valor ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Prévia</Text>
            <Badge texto={preview.classificacao} cor={preview.cor} />
            <Text style={styles.warningText}>{preview.aviso}</Text>
          </View>
        ) : null}

        <Pressable style={styles.mainButton} onPress={salvarMedicao}>
          <Ionicons name="save-outline" size={20} color="#fff" />
          <Text style={styles.mainButtonText}>Salvar medição</Text>
        </Pressable>
      </ScrollView>
    );
  }

  function renderHistorico() {
    return (
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Histórico</Text>
        <Text style={styles.subtitle}>Veja suas medições salvas.</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ maxHeight: 50 }}
        >
          {["Todos", "Normal", "Pré-diabetes", "Diabetes", "Hipoglicemia"].map(
            (item) => (
              <Pressable
                key={item}
                style={[
                  styles.filterChip,
                  filtro === item && styles.filterChipActive,
                ]}
                onPress={() => setFiltro(item)}
              >
                <Text
                  style={[
                    styles.filterText,
                    filtro === item && styles.filterTextActive,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            ),
          )}
        </ScrollView>

        <FlatList
          data={medicoesFiltradas}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma medição encontrada.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.historyCard}>
              <View style={styles.historyTop}>
                <Text style={styles.historyValue}>{item.valor} mg/dL</Text>
                <Badge texto={item.classificacao} cor={item.cor} />
              </View>

              <Text style={styles.infoText}>{item.tipo}</Text>
              <Text style={styles.infoText}>
                {item.data} às {item.hora}
              </Text>
              {item.observacao ? (
                <Text style={styles.obsText}>Obs: {item.observacao}</Text>
              ) : null}
              <Pressable onPress={() => excluirMedicao(item.id)}>
                <Text style={styles.deleteText}>Excluir</Text>
              </Pressable>
            </View>
          )}
        />
      </View>
    );
  }

  function renderDicas() {
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Dicas</Text>
        <Text style={styles.subtitle}>
          Orientações simples para acompanhar sua rotina.
        </Text>

        {dicas.map((item, index) => (
          <View key={index} style={styles.tipCard}>
            <Text style={styles.tipNumber}>{index + 1}</Text>
            <Text style={styles.tipText}>{item}</Text>
          </View>
        ))}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Aviso importante</Text>
          <Text style={styles.warningText}>
            Este aplicativo serve para organização pessoal e não substitui
            avaliação médica, exames ou tratamento profissional.
          </Text>
        </View>

        <Pressable
          style={[styles.mainButton, { backgroundColor: colors.red }]}
          onPress={limparTudo}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={styles.mainButtonText}>Apagar todo histórico</Text>
        </Pressable>
      </ScrollView>
    );
  }

  return (
    <>
      <StatusBar style="dark" translucent backgroundColor="transparent" />

      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {aba === "home" && renderHome()}
          {aba === "nova" && renderNova()}
          {aba === "historico" && renderHistorico()}
          {aba === "dicas" && renderDicas()}
        </View>

        <View style={styles.bottomBar}>
          <Pressable
            style={[
              styles.bottomItem,
              aba === "home" && styles.bottomItemActive,
            ]}
            onPress={() => setAba("home")}
          >
            <Ionicons
              name={aba === "home" ? "home" : "home-outline"}
              size={22}
              color={aba === "home" ? "#fff" : colors.sub}
            />
            <Text
              style={[
                styles.bottomText,
                aba === "home" && styles.bottomTextActive,
              ]}
            >
              Início
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.bottomItem,
              aba === "historico" && styles.bottomItemActive,
            ]}
            onPress={() => setAba("historico")}
          >
            <MaterialCommunityIcons
              name="history"
              size={22}
              color={aba === "historico" ? "#fff" : colors.sub}
            />
            <Text
              style={[
                styles.bottomText,
                aba === "historico" && styles.bottomTextActive,
              ]}
            >
              Histórico
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.bottomItem,
              aba === "nova" && styles.bottomItemActiveMain,
            ]}
            onPress={() => setAba("nova")}
          >
            <Ionicons
              name={aba === "nova" ? "add-circle" : "add-circle-outline"}
              size={26}
              color={aba === "nova" ? "#fff" : colors.primary}
            />
            <Text
              style={[
                styles.bottomText,
                aba === "nova" && styles.bottomTextActiveMain,
              ]}
            >
              Nova
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.bottomItem,
              aba === "dicas" && styles.bottomItemActive,
            ]}
            onPress={() => setAba("dicas")}
          >
            <Ionicons
              name={aba === "dicas" ? "bulb" : "bulb-outline"}
              size={22}
              color={aba === "dicas" ? "#fff" : colors.sub}
            />
            <Text
              style={[
                styles.bottomText,
                aba === "dicas" && styles.bottomTextActive,
              ]}
            >
              Dicas
            </Text>
          </Pressable>

          <Pressable
            style={styles.bottomItem}
            onPress={() => navigation.navigate("Cadastro")}
          >
            <Ionicons name="person-outline" size={22} color={colors.sub} />
            <Text style={styles.bottomText}>Perfil</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: 30,
    borderWidth: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
  },

  headerBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  headerIconBox: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#EAF1FF",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 6,
  },
  subtitle: { fontSize: 14, color: colors.sub, marginBottom: 18 },

  card: {
    backgroundColor: colors.card,
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
  },
  bigNumber: {
    fontSize: 34,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 10,
  },
  infoText: { fontSize: 14, color: colors.sub, marginTop: 6 },
  warningText: {
    fontSize: 15,
    color: colors.text,
    marginTop: 12,
    lineHeight: 22,
  },
  emptyText: { fontSize: 15, color: colors.sub, marginTop: 8 },

  summaryRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryTitle: { fontSize: 14, color: colors.sub },
  summaryValue: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    marginVertical: 8,
  },
  summarySubtitle: { fontSize: 13, color: colors.sub },

  label: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  wrapRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#EEF2FF",
    borderRadius: 999,
  },
  chipActive: { backgroundColor: colors.primary },
  chipText: { color: colors.primary, fontWeight: "700" },
  chipTextActive: { color: "#fff" },

  mainButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 30,
  },
  mainButtonText: { color: "#fff", fontSize: 16, fontWeight: "800" },

  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  badgeText: { color: "#fff", fontWeight: "800", fontSize: 13 },

  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 999,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    height: 40,
    justifyContent: "center",
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: { color: colors.text, fontWeight: "600" },
  filterTextActive: { color: "#fff" },

  historyCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  historyTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyValue: { fontSize: 24, fontWeight: "900", color: colors.text },
  obsText: { marginTop: 10, color: colors.text, fontSize: 14 },
  deleteText: { marginTop: 12, color: colors.red, fontWeight: "800" },

  tipCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
  },
  tipNumber: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    color: "#fff",
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "800",
    overflow: "hidden",
  },
  tipText: { flex: 1, color: colors.text, fontSize: 15, lineHeight: 22 },

  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 14,
    marginBottom: 18,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E9EEF5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  bottomItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    minWidth: 72,
  },
  bottomItemActive: { backgroundColor: colors.primary },
  bottomItemActiveMain: {
    backgroundColor: colors.green,
    transform: [{ scale: 1.05 }],
  },
  bottomText: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: "700",
    color: colors.sub,
  },
  bottomTextActive: { color: "#fff", fontSize: 10 },
  bottomTextActiveMain: { color: "#fff", fontSize: 10 },
});
