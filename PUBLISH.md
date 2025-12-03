🌐 Publicar el proyecto en GitHub

⚙️ Requisitos
- Git instalado y configurado (nombre y email)
- Cuenta en GitHub y un repositorio vacío creado

🧰 Método manual (terminal)
1. `git init`
2. `git add .`
3. `git commit -m "Inicial: Curritravi (React + Vite)"`
4. `git branch -M main`
5. `git remote add origin https://github.com/josepin2/curritravi.git`
6. `git push -u origin main`

⚡ Usando GitHub CLI (opcional)
- Instala `gh`: https://cli.github.com/
- Autentica: `gh auth login`
- Crea y publica en un paso (privado):
  `gh repo create josepin2/curritravi --private --source . --remote origin --push`
- O público:
  `gh repo create josepin2/curritravi --public --source . --remote origin --push`
