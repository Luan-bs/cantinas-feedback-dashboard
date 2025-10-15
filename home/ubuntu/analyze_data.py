import pandas as pd
import os

df = pd.read_csv("/home/ubuntu/upload/avaliacoes.csv", sep=";")

# Renomear colunas para facilitar o acesso
df.rename(columns={
    "Higiene": "higiene",
    "Preços": "precos",
    "Atendimento": "atendimento",
    "Comentários": "comentarios",
    "Cantina": "cantina",
    "bert_label": "sentimento_label",
    "model_score": "sentimento_score"
}, inplace=True)

# Remover linhas com 'Sem comentário' na coluna de sentimento_label, pois não contribuem para a análise de sentimento explícita
df_com_comentarios = df[df["sentimento_label"] != "Sem comentário"].copy()

# Calcular a média das avaliações por cantina
medias_por_cantina = df.groupby("cantina")[["higiene", "precos", "atendimento"]].mean().reset_index()

# Calcular a nota geral (média das médias de higiene, preços e atendimento)
medias_por_cantina["nota_geral"] = medias_por_cantina[["higiene", "precos", "atendimento"]].mean(axis=1)

# Calcular a média geral de todas as avaliações
media_geral_total = df[["higiene", "precos", "atendimento"]].mean().mean()

# Contagem de avaliações por cantina
contagem_avaliacoes_por_cantina = df.groupby("cantina").size().reset_index(name="num_avaliacoes")

# Análise de sentimento: Contagem de cada tipo de sentimento por cantina
análise_sentimento_cantina = df_com_comentarios.groupby(["cantina", "sentimento_label"]).size().unstack(fill_value=0)

# Análise de sentimento: Contagem total de cada tipo de sentimento
análise_sentimento_total = df_com_comentarios["sentimento_label"].value_counts().reset_index()
análise_sentimento_total.columns = ["sentimento_label", "count"]

# Comentários detalhados por cantina, incluindo sentimento e avaliações
comentarios_detalhados_por_cantina = df_com_comentarios[df_com_comentarios["comentarios"].notna() & (df_com_comentarios["comentarios"] != "")].groupby("cantina").apply(lambda x: x[["comentarios", "sentimento_label", "higiene", "precos", "atendimento"]].to_dict(orient="records")).reset_index(name="detalhes_comentarios")

# Salvar os resultados para uso posterior no diretório atual
output_dir = os.getcwd()
medias_por_cantina.to_json(os.path.join(output_dir, "medias_por_cantina.json"), orient="records", indent=4)
contagem_avaliacoes_por_cantina.to_json(os.path.join(output_dir, "contagem_avaliacoes_por_cantina.json"), orient="records", indent=4)
análise_sentimento_cantina.to_json(os.path.join(output_dir, "analise_sentimento_cantina.json"), orient="index", indent=4)
análise_sentimento_total.to_json(os.path.join(output_dir, "analise_sentimento_total.json"), orient="records", indent=4)
comentarios_detalhados_por_cantina.to_json(os.path.join(output_dir, "comentarios_detalhados_por_cantina.json"), orient="records", indent=4)

print("Análise de dados concluída e resultados salvos em arquivos JSON.")

