# Biome
subistitudo do Es-Lint. Sempre bom configurar apenas para o workspace

``` Open Workspace Setting (JSON)```

# Drizzle
Parecido como uma ORM.
Com ele conseguimos criar as tabelas diretamente pelo nosso projeto, sem precisar realizar o comando na mao, por exemplo pelo MysqlWorkbench

## Comando Drizzle
### Criar um arquivo SQL que tem as instrocoes de comandos, cria a migration
- ```npx drizzle-kit generate```

### Executa a migration 
No caso desse projeto precisamos instalar o postgres ```npm i postgres```
- ```npx drizzle-kit migrate```

### Cria um link para url com uma interface do banco
- ```npx drizzle-kit studio```

# Arquivo seed.ts
Arquivo para popular o banco com dados ficticios iniciais. Bom para novos devs que podem usar o projeto