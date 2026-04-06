# Guia de Deploy - Triart Estandes e Eventos

## Opcoes de Deploy

O site pode ser deployado em:
1. **Vercel** (recomendado - criador do Next.js)
2. **Netlify**
3. **Railway**
4. **Servidor proprio**

---

## Opcao 1: Deploy no Vercel (Recomendado) ⭐

### Passo 1: Preparar o repositorio Git

```bash
cd /c/Users/João\ Pedro/triart

# Inicializar git (se nao tiver feito)
git init

# Adicionar arquivo .gitignore (ja existe)
# Commitar codigo
git add .
git commit -m "Initial commit: Triart interactive map"

# Criar repositorio no GitHub
# Acesse https://github.com/new e crie um repositorio chamado 'triart'

# Adicionar remote e fazer push
git remote add origin https://github.com/SEU_USERNAME/triart.git
git branch -M main
git push -u origin main
```

### Passo 2: Conectar Vercel ao GitHub

1. Acesse https://vercel.com
2. Clique em "New Project"
3. Selecione "Import Git Repository"
4. Procure por "triart" e clique para importar
5. Configure:
   - **Framework Preset**: Next.js (detectado automaticamente)
   - **Root Directory**: ./ (raiz)
   - **Build Command**: `npm run build` (padrao)
   - **Output Directory**: `.next` (padrao)

### Passo 3: Adicionar variaveis de ambiente

Na pagina do projeto no Vercel:
1. Vá em **Settings → Environment Variables**
2. Adicione cada variavel do `.env.local`:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

3. Clique **Deploy**

### Passo 4: Seu site estara pronto!

A Vercel vai:
- Buildar o projeto automaticamente
- Fazer deploy em um subdominio (ex: triart-xi.vercel.app)
- Gerar um URL publico automaticamente

---

## Opcao 2: Deploy no Netlify

### Passo 1: Preparar o repositorio Git
(mesmo que Vercel - Passo 1)

### Passo 2: Conectar Netlify

1. Acesse https://netlify.com
2. Clique em "New site from Git"
3. Selecione GitHub e autorize
4. Procure por "triart"
5. Configure:
   - **Owner**: sua conta
   - **Branch to deploy**: main
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`

### Passo 3: Adicionar variaveis de ambiente

1. Vá em **Site settings → Build & deploy → Environment**
2. Clique **Edit variables**
3. Adicione as mesmas variaveis do Firebase (.env.local)

### Passo 4: Fazer Deploy

Clique **Deploy site** e aguarde a conclusao

---

## Opcao 3: Deploy no Railway

### Passo 1: Preparar o repositorio
(mesmo que Vercel - Passo 1)

### Passo 2: Conectar Railway

1. Acesse https://railway.app
2. Clique em "New Project"
3. Selecione "Deploy from GitHub"
4. Autorize e selecione o repositorio "triart"
5. Railway vai detectar que e um projeto Next.js

### Passo 3: Adicionar variaveis

1. Vá em **Variables**
2. Adicione as variaveis do Firebase
3. Railway vai fazer deploy automaticamente

---

## Opcao 4: Deploy em Servidor Proprio

### Requisitos:
- Servidor Linux (Ubuntu 20.04+)
- Node.js 18+ instalado
- PM2 ou similar para manter o processo rodando

### Passo 1: Preparar o servidor

```bash
# SSH no servidor
ssh user@seu_servidor.com

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Clonar repositorio
cd /home/user/apps
git clone https://github.com/SEU_USERNAME/triart.git
cd triart
```

### Passo 2: Instalar dependencias

```bash
npm install
```

### Passo 3: Criar arquivo .env.local

```bash
nano .env.local
```

Cole seu conteudo:
```
NEXT_PUBLIC_FIREBASE_API_KEY=xxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxxxx
# ... outras variaveis
```

### Passo 4: Buildar e rodar

```bash
# Build production
npm run build

# Rodar com PM2
pm2 start "npm run start" --name triart

# Salvar e fazer autostart
pm2 save
pm2 startup
```

### Passo 5: Configurar Nginx como reverse proxy

```bash
sudo nano /etc/nginx/sites-available/triart
```

```nginx
server {
    listen 80;
    server_name seu_dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/triart /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Passo 6: SSL com Certbot

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seu_dominio.com
```

---

## Resumo de Variaveis de Ambiente

Todos os deploys precisam das mesmas variaveis no `.env.local` (local) ou no painel de variaveis (producao):

```
NEXT_PUBLIC_FIREBASE_API_KEY=sua_chave_api
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

---

## Checklist Pre-Deploy

- [ ] `.env.local` preenchido com credenciais Firebase
- [ ] `public/map.png` existe (imagem do mapa)
- [ ] Build passa sem erros: `npm run build`
- [ ] Projeto git commitado e pushed para GitHub
- [ ] Firebase Firestore criado
- [ ] Firebase Auth configurado
- [ ] Firebase Storage criado
- [ ] Usuarios criados no Firebase Auth
- [ ] Documentos `users` criados no Firestore com roles

---

## Apos o Deploy

1. **Testar a pagina de login**: `seu_dominio.com/login`
2. **Verificar Firebase connection**: tente fazer login
3. **Testar o modal de stand**: clique em um stand no mapa
4. **Verificar upload de fotos**: adicione uma foto a um stand
5. **Verificar Excel export**: exporte a planilha do dashboard

---

## Recomendacao Final

Use **Vercel** (Opcao 1) porque:
- Criador oficial do Next.js
- Deploy mais simples (conecta ao GitHub)
- Ambiente otimizado para Next.js
- Free tier generoso
- DNS gratis com `.vercel.app` ou dominio proprio
