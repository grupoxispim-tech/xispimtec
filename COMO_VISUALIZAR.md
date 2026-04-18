# 🚀 Como Visualizar Seu Site

## Método 1: Abrir Diretamente (Mais Rápido)

1. Localize o arquivo `index.html` na pasta do projeto
2. Clique com botão direito no arquivo
3. Selecione "Abrir com" → Navegador (Chrome, Firefox, etc.)
4. **Pronto! Seu site está visível**

## Método 2: Servidor Local (Melhor)

### Windows - Python
```bash
# Abra o PowerShell na pasta do site e execute:
python -m http.server 8000

# Depois acesse no navegador:
# http://localhost:8000
```

### Windows - Node.js (Se instalado)
```bash
# Instale http-server
npm install -g http-server

# Execute
http-server

# Acesse
# http://localhost:8080
```

### Windows - Live Server (VS Code)
1. Abra a pasta no VS Code
2. Instale extensão "Live Server"
3. Clique direito em `index.html`
4. Selecione "Open with Live Server"

## Método 3: Netlify (Grátis & Rápido)

### Opção A: Upload de Arquivos (Mais Rápido)
1. Acesse [netlify.com](https://netlify.com)
2. Faça login/cadastro (pode usar GitHub)
3. Clique "Add new site" → "Deploy manually"
4. Arraste a pasta inteira para upload
5. **Seu site está ao vivo em segundos!**

### Opção B: GitHub + Netlify (Profissional)
1. Crie repositório no [GitHub](https://github.com)
2. Faça upload dos arquivos
3. Conecte Netlify com GitHub
4. Netlify faz deploy automático

## Visualizar Diferentes Dispositivos

### Chrome DevTools
1. Abra o site no Chrome
2. Pressione `F12` ou `Ctrl+Shift+I`
3. Clique no ícone de dispositivo (canto superior esquerdo)
4. Escolha qual dispositivo ver

### Dispositivos Recomendados para Testar
- iPhone 12/13/14
- Samsung Galaxy S21/S22
- iPad
- Desktop 1920x1080

## Verificar Performance

### Google PageSpeed Insights
1. Acesse [pagespeed.web.dev](https://pagespeed.web.dev)
2. Cole sua URL
3. Veja score de Performance, Accessibility, Best Practices, SEO

Objetivo: Score > 90 em todas as categorias

### Lighthouse (Chrome)
1. Abra DevTools (F12)
2. Vá para aba "Lighthouse"
3. Clique "Analyze page load"
4. Aguarde relatório

## Editar Conteúdo

### Alterar Textos
1. Abra `index.html` com editor de texto (VS Code, Notepad++)
2. Procure o texto que deseja alterar
3. Salve com `Ctrl+S`
4. Recarregue o site no navegador (F5)

### Alterar Cores
1. Abra `styles.css`
2. No topo, você verá:
```css
:root {
    --primary: #2DD9D9;  /* Azul/Ciano - ALTERE AQUI */
    --dark: #0a1a1a;     /* Preto muito escuro */
}
```
3. Troque os códigos HEX das cores
4. Salve e recarregue

### Alterar Logo
1. Coloque sua imagem em `imagens/logo.jpg`
2. Substitua o arquivo anterior com o mesmo nome
3. O site automaticamente usará a nova logo

## Testar Funcionalidades

### Teste do Menu Mobile
1. Redimensione a janela para < 768px
2. Clique no ícone de menu (☰)
3. Menu deve abrir e fechar corretamente

### Teste do WhatsApp
1. Clique no botão WhatsApp flutuante ou nos botões verdes
2. Seu WhatsApp Website deve abrir
3. Mensagem pré-preenchida deve aparecer

### Teste de Formulário
1. Preencha campos de contato
2. Clique "Enviar Mensagem"
3. Deve redirecionar para WhatsApp

### Teste de Scroll
1. Clique em qualquer link de navegação (ex: "Ver Projetos")
2. Deve fazer scroll suave até a seção
3. Menu deve fechar automaticamente (mobile)

## Console de Erros

Se algo não funcionar:

1. Abra DevTools (F12)
2. Vá para aba "Console"
3. Procure por erros em vermelho
4. Mensagens lá indicam o problema

### Erros Comuns
- **404 Not Found** → Arquivo faltando (verifique local)
- **Uncaught Error** → Erro no JavaScript (verifique sintaxe)
- **CORS Error** → Problema de origem (não comum nesse site)

## Testar em Navegadores Diferentes

### Firefox
1. Download em [mozilla.org](https://mozilla.org/firefox)
2. Abra o site
3. Deveria funcionar identicamente

### Safari (Mac)
1. Disponível em Mac automaticamente
2. Funciona bem com este site

### Edge (Windows)
1. Download em [microsoft.com/edge](https://microsoft.com/edge)
2. Moderno e bem otimizado

## Performance: Tempo de Carregamento

Esperado:
- Desktop: 1-2 segundos
- Mobile: 2-3 segundos

Se mais lento:
1. Comprima imagens com [TinyPNG](https://tinypng.com)
2. Minifique CSS/JS
3. Verifique velocidade de internet
4. Use outro navegador

## Publicação Final

Quando tudo estiver pronto:

1. **Verificar**
   - [ ] Todos os textos corretos
   - [ ] Logo bonita
   - [ ] Sem erros no console
   - [ ] Responsivo em mobile
   - [ ] WhatsApp funciona

2. **Hospedar**
   - Netlify (grátis) ← RECOMENDADO
   - Vercel (grátis)
   - GitHub Pages (grátis)
   - Seu próprio servidor

3. **Domínio**
   - Compre em [Namecheap](https://namecheap.com) ou [Google Domains](https://domains.google)
   - Configure DNS apontando para hosting
   - Ative HTTPS/SSL

4. **SEO**
   - Registre no [Google Search Console](https://search.google.com/search-console)
   - Submeta sitemap.xml
   - Configure Analytics

## 🎉 Sucesso!

Seu site está pronto e online!

Próximos passos:
- Compartilhe com clientes
- Peça para fazerem testes
- Recolha feedback
- Otimize conforme necessário

---

**Dúvidas?** Veja os arquivos:
- `README.md` - Documentação completa
- `GUIA_IMPLEMENTACAO.md` - Instruções passo a passo
- `OTIMIZACOES.md` - Dicas avançadas
