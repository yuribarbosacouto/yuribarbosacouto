# Gerar o banner do perfil

Use Node.js 20.9 ou mais recente e FFmpeg disponível no PATH. Na raiz do repositório, execute:

```sh
npm ci
npm run build:banner
```

O comando substitui `assets/hello.gif` após gerar e codificar os 90 quadros. A versão já publicada está no Git.

Para conservar os quadros intermediários, execute `npm run build:banner -- caminho/para/quadros`. O gerador aceita o diretório como primeiro argumento, como nas versões anteriores, e limita o GIF a 90 quadros mesmo se a pasta contiver imagens antigas. A variável `SHARP_MODULE` continua disponível para indicar outra instalação do Sharp.
