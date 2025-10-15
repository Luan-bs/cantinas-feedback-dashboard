import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Home, TrendingUp, Store } from 'lucide-react'
import './App.css'

// Importar dados
import mediasData from './assets/medias_por_cantina.json'
import contagemData from './assets/contagem_avaliacoes_por_cantina.json'
import sentimentoCantinaData from './assets/analise_sentimento_cantina.json'
import sentimentoTotalData from './assets/analise_sentimento_total.json'
import comentariosDetalhadosData from './assets/comentarios_detalhados_por_cantina.json'

function App() {
  const [activeView, setActiveView] = useState('inicio')
  const [selectedCantina, setSelectedCantina] = useState(null)

  // Processar dados de sentimento por cantina
  const sentimentoCantina = Object.entries(sentimentoCantinaData).reduce((acc, [cantina, sentimentos]) => {
    acc[cantina] = sentimentos
    return acc
  }, {})

  // Cores para sentimentos
  const SENTIMENT_COLORS = {
    'Positivo': '#f59e0b',
    'Negativo': '#ef4444',
    'Neutro': '#eab308',
    'Sem comentário': '#6b7280'
  }

  // Calcular totais gerais
  const totalAvaliacoes = contagemData.reduce((sum, item) => sum + item.num_avaliacoes, 0)
  const mediaGeralGlobal = mediasData.reduce((sum, item) => sum + item.nota_geral, 0) / mediasData.length

  // Tela Inicial
  const TelaInicio = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Dashboard de Feedback - Cantinas</h1>
        <p className="text-muted-foreground">Análise completa de avaliações e sentimentos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-border hover:border-accent transition-all duration-300 cursor-pointer transform hover:scale-105" onClick={() => setActiveView('geral')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Visão Geral
            </CardTitle>
            <CardDescription>Comparativo entre cantinas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">{totalAvaliacoes}</p>
            <p className="text-sm text-muted-foreground">Total de Avaliações</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:border-accent transition-all duration-300 cursor-pointer transform hover:scale-105" onClick={() => setActiveView('cantinas')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5 text-accent" />
              Por Cantina
            </CardTitle>
            <CardDescription>Análise detalhada individual</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">{mediasData.length}</p>
            <p className="text-sm text-muted-foreground">Cantinas Avaliadas</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Média Geral</CardTitle>
            <CardDescription>Nota média de todas as cantinas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-accent">{mediaGeralGlobal.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">de 5.00</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Distribuição de Sentimentos</CardTitle>
          <CardDescription>Análise geral de comentários</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={sentimentoTotalData}
                dataKey="count"
                nameKey="sentimento_label"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {sentimentoTotalData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[entry.sentimento_label] || '#6b7280'} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )

  // Tela Geral (Comparativo)
  const TelaGeral = () => {
    const dadosComparativos = mediasData.map(cantina => ({
      nome: cantina.cantina,
      'Higiene': cantina.higiene,
      'Preços': cantina.precos,
      'Atendimento': cantina.atendimento,
      'Nota Geral': cantina.nota_geral
    }))

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Visão Geral Comparativa</h2>
          <p className="text-muted-foreground">Comparação de desempenho entre as cantinas</p>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Média Geral por Cantina</CardTitle>
            <CardDescription>Comparação das notas gerais</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={dadosComparativos}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="nome" stroke="#d1d5db" />
                <YAxis stroke="#d1d5db" domain={[0, 5]} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                <Legend />
                <Bar dataKey="Nota Geral" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Comparativo por Categoria</CardTitle>
            <CardDescription>Higiene, Preços e Atendimento</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={450}>
              <BarChart data={dadosComparativos}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="nome" stroke="#d1d5db" />
                <YAxis stroke="#d1d5db" domain={[0, 5]} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                <Legend />
                <Bar dataKey="Higiene" fill="#f59e0b" />
                <Bar dataKey="Preços" fill="#ef4444" />
                <Bar dataKey="Atendimento" fill="#eab308" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mediasData.map((cantina, index) => {
            const contagem = contagemData.find(c => c.cantina === cantina.cantina)
            const sentimentos = sentimentoCantina[cantina.cantina] || {}
            
            return (
              <Card key={index} className="bg-card border-border hover:border-accent transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">{cantina.cantina}</CardTitle>
                  <CardDescription>{contagem?.num_avaliacoes || 0} avaliações</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Nota Geral:</span>
                    <span className="font-bold text-accent">{cantina.nota_geral.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Higiene:</span>
                    <span className="font-bold">{cantina.higiene.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Preços:</span>
                    <span className="font-bold">{cantina.precos.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Atendimento:</span>
                    <span className="font-bold">{cantina.atendimento.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  // Tela Por Cantina
  const TelaCantinas = () => {
    const [comentarioFilter, setComentarioFilter] = useState('Todos')

    const cantinaAtual = selectedCantina || mediasData[0].cantina
    const dadosCantina = mediasData.find(c => c.cantina === cantinaAtual)
    const contagemCantina = contagemData.find(c => c.cantina === cantinaAtual)
    const sentimentosCantina = sentimentoCantina[cantinaAtual] || {}
    const comentariosDetalhes = comentariosDetalhadosData.find(c => c.cantina === cantinaAtual)?.detalhes_comentarios || []

    const dadosSentimento = Object.entries(sentimentosCantina).map(([label, count]) => ({
      sentimento_label: label,
      count
    }))

    const dadosCategoria = [
      { categoria: 'Higiene', valor: dadosCantina.higiene },
      { categoria: 'Preços', valor: dadosCantina.precos },
      { categoria: 'Atendimento', valor: dadosCantina.atendimento }
    ]

    const comentariosFiltrados = comentarioFilter === 'Todos'
      ? comentariosDetalhes
      : comentariosDetalhes.filter(c => c.sentimento_label === comentarioFilter)

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Análise por Cantina</h2>
          <p className="text-muted-foreground">Detalhamento individual de cada estabelecimento</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {mediasData.map((cantina, index) => (
            <Button
              key={index}
              variant={cantinaAtual === cantina.cantina ? "default" : "outline"}
              onClick={() => setSelectedCantina(cantina.cantina)}
              className="transition-all duration-300"
            >
              {cantina.cantina}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>{cantinaAtual}</CardTitle>
              <CardDescription>{contagemCantina?.num_avaliacoes || 0} avaliações registradas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-5xl font-bold text-accent">{dadosCantina.nota_geral.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Nota Geral</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Higiene:</span>
                  <span className="font-bold text-lg">{dadosCantina.higiene.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Preços:</span>
                  <span className="font-bold text-lg">{dadosCantina.precos.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Atendimento:</span>
                  <span className="font-bold text-lg">{dadosCantina.atendimento.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Avaliação por Categoria</CardTitle>
              <CardDescription>Desempenho em cada aspecto</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dadosCategoria} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" domain={[0, 5]} stroke="#d1d5db" />
                  <YAxis type="category" dataKey="categoria" stroke="#d1d5db" width={100} />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                  <Bar dataKey="valor" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Análise de Sentimento</CardTitle>
            <CardDescription>Distribuição de comentários por sentimento</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={dadosSentimento}
                  dataKey="count"
                  nameKey="sentimento_label"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {dadosSentimento.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[entry.sentimento_label] || '#6b7280'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Comentários</CardTitle>
            <CardDescription>Feedback dos usuários</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              {['Todos', 'Positivo', 'Negativo', 'Neutro'].map(filter => (
                <Button
                  key={filter}
                  variant={comentarioFilter === filter ? "default" : "outline"}
                  onClick={() => setComentarioFilter(filter)}
                  className="transition-all duration-300"
                >
                  {filter}
                </Button>
              ))}
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {comentariosFiltrados.length > 0 ? (
                comentariosFiltrados.map((comentario, index) => (
                  <div key={index} className="p-3 bg-secondary rounded-lg border border-border hover:border-accent transition-all duration-300">
                    <p className="text-sm text-foreground italic">"{comentario.comentarios}"</p>
                    <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                      <span>Sentimento: <span className="font-bold" style={{ color: SENTIMENT_COLORS[comentario.sentimento_label] }}>{comentario.sentimento_label}</span></span>
                      <span>Higiene: {comentario.higiene} | Preços: {comentario.precos} | Atendimento: {comentario.atendimento}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center">Nenhum comentário disponível para este filtro</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <nav className="flex gap-2 p-2 bg-card rounded-lg border border-border">
          <Button
            variant={activeView === 'inicio' ? "default" : "ghost"}
            onClick={() => setActiveView('inicio')}
            className="flex items-center gap-2 transition-all duration-300"
          >
            <Home className="w-4 h-4" />
            Início
          </Button>
          <Button
            variant={activeView === 'geral' ? "default" : "ghost"}
            onClick={() => setActiveView('geral')}
            className="flex items-center gap-2 transition-all duration-300"
          >
            <TrendingUp className="w-4 h-4" />
            Visão Geral
          </Button>
          <Button
            variant={activeView === 'cantinas' ? "default" : "ghost"}
            onClick={() => setActiveView('cantinas')}
            className="flex items-center gap-2 transition-all duration-300"
          >
            <Store className="w-4 h-4" />
            Por Cantina
          </Button>
        </nav>

        {activeView === 'inicio' && <TelaInicio />}
        {activeView === 'geral' && <TelaGeral />}
        {activeView === 'cantinas' && <TelaCantinas />}
      </div>
    </div>
  )
}

export default App

