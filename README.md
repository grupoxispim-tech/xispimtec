# 🚗 OLICAR - Site Profissional

Seu site foi criado com sucesso! Um design moderno, responsivo e chamativo.

## 📁 Arquivos do Projeto

- `index.html` - Página principal do site
- `styles.css` - Estilos e design
- `script.js` - Funcionalidades interativas
- `imagens/` - Pasta com suas fotos (1.jpg até 6.jpg)

## 📝 Como Utilizar

### 1. **Abrir o site**
   - Abra o arquivo `index.html` em seu navegador
   - Ou hospede em um servidor web

### 2. **Editar Informações Pessoais/Empresariais**

#### No arquivo `index.html`, procure e edite:

**Seção "Sobre":**
```html
<p><strong>Adicione sua informação pessoal/empresarial aqui</strong></p>
```
Substitua pelo seu texto descritivo.

**Seção "Contato":**
```html
<p><a href="tel:+55xx9xxxx-xxxx">(XX) 9 XXXX-XXXX</a></p>
<p><a href="mailto:olicarautomecanica@hotmail.com">olicarautomecanica@hotmail.com</a></p>
<p>Rua, Número - Cidade, Estado, CEP</p>
```

**Links Sociais (Instagram, Facebook, WhatsApp):**
```html
<a href="https://instagram.com/seu_usuario" target="_blank">
<a href="https://facebook.com/sua_pagina" target="_blank">
<a href="https://wa.me/55xxxxxxxxxxxx" target="_blank">
```

### 3. **Adicionar mais fotos**
   - Coloque suas imagens JPG/PNG na pasta `imagens/`
   - Abra `index.html` e adicione itens na galeria:
   ```html
   <div class="galeria-item">
       <img src="imagens/7.jpg" alt="Foto 7">
       <div class="galeria-overlay">
           <h3>Foto 7</h3>
       </div>
   </div>
   ```

### 4. **Personalizar cores**
   - Abra `styles.css`
   - Procure por `#667eea` (azul) e `#764ba2` (roxo) para alterar a cor principal
   - Substitua por suas cores desejadas (use código HEX)

## 🎨 Características do Site

✅ Design moderno e responsivo (funciona em mobile e desktop)
✅ Galeria de fotos com efeito hover
✅ Links de redes sociais (Instagram, Facebook, WhatsApp)
✅ Seção de contato com informações
✅ Animações suaves
✅ Menu de navegação sticky
✅ Hero section chamativo
✅ Lightbox para visualizar fotos em grande

## 📱 Responsividade

O site se adapta perfeitamente para:
- 📱 Celulares (480px+)
- 📱 Tablets (768px+)
- 🖥️ Desktops (1200px+)

## 🔗 Passo a Passo Final

1. **Edite seus dados** no `index.html`:
   - Telefone
   - Email
   - Endereço
   - Links de redes sociais

2. **Adicione suas fotos** na pasta `imagens/`:
   - Use nomes: 1.jpg, 2.jpg, 3.jpg, etc.
   - Tamanho recomendado: 500x500px ou 1000x1000px

3. **Customize as cores** em `styles.css` se desejar

4. **Hospede em um servidor** se quiser publicar na internet

## 🚀 Hospedagem Online Gratuita

Alternativas para colocar seu site na internet:
- **GitHub Pages** (gratuito)
- **Netlify** (gratuito)
- **Vercel** (gratuito)
- **000webhost** (gratuito)
- **Hostinger** (pago, mas barato)

## ✅ Comentários Permanentes Grátis (Supabase)

Este projeto agora está preparado para salvar comentários de forma permanente no Supabase (plano grátis).

Arquivos usados:

- `supabase-config.js`
- `supabase-setup.sql`
- `script.js`

Passo a passo:

1. Crie um projeto no Supabase.
2. Abra o SQL Editor e execute todo o conteúdo de `supabase-setup.sql`.
3. Em **Project Settings > API**, copie:
   - Project URL
   - anon public key
4. Preencha `supabase-config.js` com esses dois valores.
5. Publique seu site (Netlify, Vercel, GitHub Pages ou outro hosting estático).

Resultado:

- Comentários ficam no banco na nuvem.
- Fotos e vídeos ficam no bucket `avaliacoes-midia`.
- Novos comentários aparecem em tempo real no site.

## 🔒 Regras de Segurança Firebase

Arquivos prontos no projeto:

- `firestore.rules`
- `storage.rules`

Como aplicar:

1. Abra o Firebase Console e entre no seu projeto.
2. Vá em **Firestore Database** > **Rules**.
3. Copie todo o conteúdo de `firestore.rules` e publique.
4. Vá em **Storage** > **Rules**.
5. Copie todo o conteúdo de `storage.rules` e publique.

O que essas regras fazem:

- Firestore:
   - Permite leitura pública das avaliações.
   - Permite apenas criação de novos documentos em `avaliacoes`.
   - Bloqueia edição e exclusão.
   - Valida campos como nome, nota, comentário e limites de tamanho.
- Storage:
   - Permite upload apenas em `avaliacoes/fotos` e `avaliacoes/videos`.
   - Aceita apenas imagem em fotos e vídeo em vídeos.
   - Limita tamanho (imagem até 5MB e vídeo até 20MB).
   - Bloqueia qualquer outro caminho do bucket.

## ☁️ Deploy com Firebase CLI

Arquivos de deploy já criados:

- `.firebaserc`
- `firebase.json`

Antes de publicar:

1. Edite `.firebaserc` e troque `SEU_PROJECT_ID_AQUI` pelo ID real do seu projeto.
2. Confira se `firebase-config.js` está com as chaves corretas.

Comandos no terminal (na pasta do projeto):

```bash
npm install -g firebase-tools
firebase login
firebase use --add
firebase deploy --only firestore:rules,storage,hosting
```

Se quiser publicar só as regras:

```bash
firebase deploy --only firestore:rules,storage
```

Se quiser publicar só o site:

```bash
firebase deploy --only hosting
```

## 📞 Substituições Necessárias

Complete as seguintes informações:

| Campo | Substitua por |
|-------|----------------|
| `seu_usuario` | Seu @usuario do Instagram |
| `sua_pagina` | Sua página do Facebook |
| `55xxxxxxxxxxxx` | Seu WhatsApp (55 + DDD + número) |
| `(XX) 9 XXXX-XXXX` | Seu número de telefone |
| `olicarautomecanica@hotmail.com` | Seu email |
| `OLICAR` | Nome da sua empresa |

## 💡 Dicas

1. **Qualidade das imagens**: Use imagens de alta qualidade (não muito grandes para não deixar o site lento)
2. **SEO**: Edite o `<title>` no `index.html` com o nome da sua empresa
3. **Teste em mobile**: Abra em seu celular para verificar se está perfeito
4. **Compartilhe**: Depois de pronto, compartilhe o link com seus clientes

## 🆘 Problemas Comuns

**Imagens não aparecem:**
- Verifique se as imagens estão na pasta `imagens/`
- Certifique-se do caminho em `src="imagens/X.jpg"`

**Links não funcionam:**
- Use formatos corretos:
  - Instagram: `https://instagram.com/usuario`
  - Facebook: `https://facebook.com/pagina`
  - WhatsApp: `https://wa.me/55DDD9XXXXXXXX`

**Site não fica responsivo:**
- Limpe cache do navegador (Ctrl+Shift+Del)
- Recarregue a página (F5)

---

**Desenvolvido com ❤️ para seu sucesso!** 🚗

Se precisar de ajuda, revise este arquivo ou entre em contato com um especialista em web.
