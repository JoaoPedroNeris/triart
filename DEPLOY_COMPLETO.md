# Deploy Completo: Firebase + Vercel - Triart Estandes e Eventos

**Tempo estimado:** 30-45 minutos

---

## PARTE 1: Preparar o Repositorio Git

### Passo 1.1: Verificar status git

```bash
cd "/c/Users/João Pedro/triart"
git status
```

Esperado: alguns arquivos modificados ou nao trackados.

### Passo 1.2: Criar .gitignore atualizado

```bash
cat > .gitignore << 'EOF'
# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (NAO COMMITAR)
.env
.env*.local
.env.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode
.idea
*.swp
*.swo

# OS
Thumbs.db
EOF
```

### Passo 1.3: Fazer commit inicial

```bash
git add .
git commit -m "feat: Initial Triart project setup with Firebase integration"
```

---

## PARTE 2: Criar Projeto Firebase

### Passo 2.1: Acessar Firebase Console

1. Acesse https://console.firebase.google.com
2. Clique em **"Criar projeto"**
3. Digite o nome: `triart-estandes`
4. Clique em **"Continuar"**

### Passo 2.2: Configurar Analytics (opcional)

- Desmarque "Ativar Google Analytics" (nao precisa agora)
- Clique em **"Criar projeto"**
- Aguarde 1-2 minutos

### Passo 2.3: Adicionar um aplicativo web

Apos criar o projeto:

1. Clique no icone **`</>`** (Add app)
2. Selecione **"Web"**
3. Digite o nome do app: `triart-web`
4. ✅ Marque "Tambem configurar Firebase Hosting para este app" (vamos usar o Vercel, mas pode deixar marcado)
5. Clique em **"Registrar app"**

### Passo 2.4: Copiar credenciais Firebase

A console vai exibir um bloco de codigo como:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "triart-estandes.firebaseapp.com",
  projectId: "triart-estandes",
  storageBucket: "triart-estandes.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123..."
};
```

**COPIE E GUARDE ESSAS CREDENCIAIS** - voce vai usar em breve.

Clique em **"Continuar para o console"**

---

## PARTE 3: Configurar Firestore Database

### Passo 3.1: Criar Firestore Database

No console Firebase:

1. Vá em **"Firestore Database"** (menu esquerdo)
2. Clique em **"Criar banco de dados"**
3. Selecione a regiao: **`southamerica-east1`** (Sao Paulo)
4. Modo de seguranca: **"Modo de producao"**
5. Clique em **"Criar"**

### Passo 3.2: Criar colecoes iniciais

Apos criar o banco:

1. Clique em **"+ Iniciar colecao"**
2. ID da colecao: `users`
3. Clique em **"Proximo"**
4. Clique em **"Salvar"** (sem adicionar documento agora)

Repita para `stands`:
1. Clique em **"+ Iniciar colecao"**
2. ID da colecao: `stands`
3. Clique em **"Proximo"**
4. Clique em **"Salvar"**

### Passo 3.3: Configurar Firestore Security Rules

1. Vá em **"Regras"** (aba superior)
2. Substitua todo conteudo por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permite leitura/escrita se usuario esta autenticado
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Clique em **"Publicar"**

---

## PARTE 4: Configurar Firebase Authentication

### Passo 4.1: Ativar autenticacao por email

No console Firebase:

1. Vá em **"Authentication"** (menu esquerdo)
2. Clique em **"Comece"**
3. Na aba **"Provedores de login"**, clique em **"Email/Senha"**
4. Marque **"Ativar"**
5. Clique em **"Salvar"**

### Passo 4.2: Criar usuario de teste

1. Vá em **"Usuarios"** (aba)
2. Clique em **"Adicionar usuario"**
3. Email: `admin@triart.local`
4. Senha: `SenhaForte123!@` (guarde isso)
5. Clique em **"Adicionar usuario"**

Anote o **UID** do usuario criado (vai na proxima linha do usuario)

---

## PARTE 5: Configurar Firebase Storage

### Passo 5.1: Criar Storage

No console Firebase:

1. Vá em **"Storage"** (menu esquerdo)
2. Clique em **"Comece"**
3. Leia os avisos e clique em **"Proximo"**
4. Selecione a regiao: **`southamerica-east1`** (Sao Paulo)
5. Clique em **"Concluir"**

### Passo 5.2: Configurar Security Rules do Storage

1. Vá em **"Regras"** (aba)
2. Substitua por:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Clique em **"Publicar"**

---

## PARTE 6: Criar usuario no Firestore

### Passo 6.1: Adicionar documento do usuario

1. Vá em **"Firestore Database"**
2. Clique na colecao **`users`**
3. Clique em **"Adicionar documento"**
4. ID do documento: cole o **UID** do usuario que criou acima
5. Adicione os campos:
   - Campo: `email` | Tipo: `String` | Valor: `admin@triart.local`
   - Campo: `name` | Tipo: `String` | Valor: `Administrador`
   - Campo: `role` | Tipo: `String` | Valor: `admin`
6. Clique em **"Salvar"**

---

## PARTE 7: Atualizar .env.local (local)

### Passo 7.1: Criar arquivo .env.local

Na pasta do projeto:

```bash
cat > .env.local << 'EOF'
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=triart-estandes.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=triart-estandes
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=triart-estandes.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123...
EOF
```

**Substitua os valores** pelas credenciais do seu Firebase (Passo 2.4)

### Passo 7.2: Testar localmente

```bash
npm run dev
```

Esperado:
- Servidor roda em http://localhost:3000
- Pagina de login aparece
- Pode fazer login com `admin@triart.local` / `SenhaForte123!@`

### Passo 7.3: Teste de comunicacao Firebase (LOCAL)

Apos fazer login:

1. Clique em um stand no mapa
2. Vá para a aba **"Notas"**
3. Digite: `Teste de comunicacao Firebase`
4. Aguarde 1 segundo
5. Deve aparecer "Salvo" em verde

**Verificar no Firebase Console:**
1. Vá em **Firestore Database**
2. Procure pela colecao **`stands`**
3. Deve ter criado um documento `stand_1` com a nota

Se funcionar ✅ - Firebase esta conectado corretamente no local!

---

## PARTE 8: Push para GitHub

### Passo 8.1: Criar repositorio no GitHub

1. Acesse https://github.com/new
2. Nome: `triart`
3. Descricao: `Interactive map for fair stand management`
4. Tipo: **Public** (ou Private se preferir)
5. ✅ Marque "Add a README file"
6. Clique em **"Create repository"**

### Passo 8.2: Fazer push do codigo

```bash
cd "/c/Users/João Pedro/triart"

# Remover remote anterior (se existir)
git remote remove origin 2>/dev/null || true

# Adicionar novo remote (substitua SEU_USERNAME)
git remote add origin https://github.com/SEU_USERNAME/triart.git

# Fazer push
git branch -M main
git push -u origin main
```

Esperado: codigo enviado para GitHub com sucesso

---

## PARTE 9: Deploy no Vercel

### Passo 9.1: Conectar Vercel ao GitHub

1. Acesse https://vercel.com
2. Clique em **"New Project"**
3. Clique em **"Import Git Repository"**
4. Autorize o acesso ao GitHub (primeira vez)
5. Procure por `triart` e clique em **"Import"**

### Passo 9.2: Configurar o projeto

Na proxima tela:

**Framework Preset:** `Next.js` (detectado automaticamente)

Clique em **"Environment Variables"** e adicione:

```
NEXT_PUBLIC_FIREBASE_API_KEY = [seu_api_key]
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = triart-estandes.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = triart-estandes
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = triart-estandes.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = [seu_id]
NEXT_PUBLIC_FIREBASE_APP_ID = [seu_app_id]
```

### Passo 9.3: Fazer Deploy

1. Clique em **"Deploy"**
2. Aguarde 2-3 minutos

Esperado:
- Build passa com sucesso ✅
- URL de deploy gerada (ex: `triart-xyz.vercel.app`)

### Passo 9.4: Verificar Deploy

Apos deploy:

1. Acesse a URL gerada
2. Vá para login
3. Tente fazer login com `admin@triart.local` / `SenhaForte123!@`

Se funcionar ✅ - Vercel esta conectado ao Firebase!

---

## PARTE 10: Testar Comunicacao Completa

### Teste 1: Autenticacao

```
1. Acesse seu_dominio.vercel.app
2. Clique em login
3. Email: admin@triart.local
4. Senha: SenhaForte123!@
5. Deve redirecionar para /evento
```

**Status esperado:** ✅ Autenticacao funciona

### Teste 2: Ler dados do Firestore

```
1. Apos logado, acesse o mapa
2. Debe exibir 62 stands
3. Nao deve ter erro no console (F12)
```

**Status esperado:** ✅ Leitura funciona

### Teste 3: Escrever dados no Firestore

```
1. Clique em um stand
2. Vá para "Notas"
3. Digite: "Teste de deploy"
4. Aguarde 1s
5. Deve mostrar "Salvo"
```

**Verificar no Firebase:**
1. Firebase Console > Firestore Database
2. Procure `stand_X` com suas notas

**Status esperado:** ✅ Escrita funciona

### Teste 4: Upload de Fotos (Firebase Storage)

```
1. Mesmo stand, aba "Fotos"
2. Clique "Adicionar Foto"
3. Selecione uma imagem
4. Aguarde upload completo
5. Foto deve aparecer na galeria
```

**Verificar no Firebase:**
1. Firebase Console > Storage
2. Procure a pasta `stands/stand_X/photos`

**Status esperado:** ✅ Upload funciona

### Teste 5: Checklist (Firestore Update)

```
1. Aba "Checklist"
2. Marque um item como concluido
3. Deve atualizar com check imediato
```

**Verificar no Firebase:**
1. Firestore Database > stands > stand_X
2. Campo `checklist` deve ter `checked: true`

**Status esperado:** ✅ Update funciona

---

## PARTE 11: Configurar Domain Customizado (Opcional)

### Passo 11.1: Comprar dominio

Use qualquer registrador (Google Domains, Namecheap, etc)

Exemplo: `triart.com.br`

### Passo 11.2: Conectar ao Vercel

1. No painel Vercel, vá em **"Settings"**
2. Clique em **"Domains"**
3. Digite seu dominio
4. Vercel vai exibir as **DNS records** para adicionar

### Passo 11.3: Adicionar DNS records

No seu registrador de dominio, adicione:
- Type: `CNAME`
- Name: `@` (ou leave blank)
- Value: (a que Vercel forneceu)

Aguarde 24h para DNS propagar

---

## PARTE 12: Configurar CORS no Firebase (Se necessario)

Se receber erro de CORS, faca isto:

### Passo 12.1: Ativar CORS no Storage

No Firebase Console > Storage:

1. Clique em **"Criar arquivo CORS"**
2. Copie isto e salve como `cors.json`:

```json
[
  {
    "origin": ["https://seu_dominio.vercel.app"],
    "method": ["GET", "HEAD", "DELETE"],
    "responseHeader": ["Content-Type"],
    "maxAgeSeconds": 3600
  }
]
```

3. Faca upload deste arquivo para a raiz do Storage

---

## PARTE 13: Monitorar e Debugar

### Verificar Logs do Vercel

1. Painel Vercel > projeto
2. Aba **"Deployments"**
3. Clique no deployment mais recente
4. Vá em **"Logs"**

### Verificar Logs do Firebase

1. Firebase Console > Firestore Database
2. Aba **"Logs"** (no rodape)
3. Filtre por erros

### Usar DevTools (F12)

No navegador do seu site:
1. Pressione **F12**
2. Aba **"Console"**
3. Procure por erros

Erros comuns:
- `auth/invalid-api-key` → chaves nao foram adicionadas ao Vercel
- `Permission denied` → Security Rules estao muito restritas
- `CORS error` → Storage CORS nao configurado

---

## CHECKLIST FINAL

### Firebase
- [ ] Projeto criado (`triart-estandes`)
- [ ] Firestore Database criado em `southamerica-east1`
- [ ] Collections `users` e `stands` criadas
- [ ] Firestore Security Rules configuradas
- [ ] Authentication (Email/Senha) ativada
- [ ] Usuario `admin@triart.local` criado
- [ ] Documento do usuario criado em `users` collection
- [ ] Storage criado em `southamerica-east1`
- [ ] Storage Security Rules configuradas
- [ ] Credenciais copiadas e guardadas

### Local (seu computador)
- [ ] `.env.local` criado com credenciais Firebase
- [ ] `npm run dev` roda sem erros
- [ ] Pode fazer login localmente
- [ ] Pode editar notas (aparece "Salvo")
- [ ] Pode clicar em stands e abrir modal
- [ ] Verifica Firestore Console e ve dados salvos

### GitHub
- [ ] Repositorio criado (`triart`)
- [ ] Codigo faz push (git push origin main)
- [ ] Todos os arquivos estao no GitHub

### Vercel
- [ ] Projeto importado do GitHub
- [ ] 6 variaveis de ambiente adicionadas
- [ ] Deploy bem-sucedido (sem erros)
- [ ] URL publica funciona
- [ ] Pode fazer login no Vercel
- [ ] Pode editar notas no Vercel
- [ ] Dados salvos aparecem no Firebase Console

### Comunicacao
- [ ] ✅ Firebase + Vercel se comunicam
- [ ] ✅ Login funciona
- [ ] ✅ Leitura de dados funciona
- [ ] ✅ Escrita de dados funciona
- [ ] ✅ Upload de fotos funciona

---

## PROXIMAS ETAPAS

Apos tudo funcionando:

1. **Criar mais usuarios** no Firebase Auth
2. **Criar documentos** para cada usuario na colecao `users`
3. **Testar com multiplos usuarios** para garantir isolamento
4. **Configurar dominio customizado** (opcional)
5. **Fazer backup** do Firebase Console

---

## SUPORTE E DEBUG

Se algo nao funciona:

### Login nao funciona
```
→ Verificar console (F12)
→ Confirmar credenciais Firebase estao corretas
→ Confirmar usuario criado no Firebase Auth
```

### Dados nao salvam
```
→ Verificar Network (F12 > Network)
→ Verificar Firestore Security Rules
→ Confirmar usuario esta logado
```

### Fotos nao fazem upload
```
→ Verificar tamanho da imagem (max 5MB)
→ Verificar Storage Security Rules
→ Verificar CORS configuration
```

### Erro CORS
```
→ Adicionar dominio do Vercel ao CORS do Storage
→ Aguardar propagacao (ate 24h)
```

---

**Pronto! Seu site Triart esta no ar com Firebase + Vercel! 🚀**
