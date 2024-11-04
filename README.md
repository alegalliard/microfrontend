# Microfrontend (Angular 18.2.6)

Projeto para teste de conceito de microfrontends

Podemos ter vários microfrontends implementados na aplicação host (principal)

Gerando a aplicação de base
`ng new microfrontend --create-application=false`

Criando uma aplicação que pode ser exportada (mfe = micro front end)
`ng g application mfe-app --routing --no-standalone`

Para subir o server do mfe
`ng s mfe-app -o`

Criando uma aplicação host
`ng g application host-app --routing --no-standalone`

Instala o webpack no projeto principal
`npm i webpack-cli --save-dev`


Para gerar o webpack config
Instala a arquitetura do module-federation para o mfe 
`ng add @angular-architects/module-federation --project mfe-app --port=4201`

Instala a arquitetura do module-federation para host (mas não é obrigatório)
`ng add @angular-architects/module-federation --project host-app --port=4202`

no angular.json agora existem esses dois projetos configurados

### Começando a gerar os componentes
`ng g module profile --project=mfe-app` -> gerando o módulo que vai ser exportado
`ng g c profile --project=mfe-app` -> gerando um componente do módulo

Agora, no webpack do mfe é preciso exportar o módulo através da chave plugins, tal como está a partir da linha 28 do `new ModuleFederationPlugin....`

No output do arquivo do webpack, configurar também o `scriptType: "text/javascript"`

Depois, criar a rota do meu componente e módulo `profile` e exportar no `app.module` e rodar o projeto pra conferir `ng s mfe-app -o`

Se digitar http://localhost:4201/remoteEntry.js no browser, ele retorna o JS

Configurar também o profile.module do mfe na parte de imports para a rota funcionar na aplicação host
```javascript
imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forChild([
        {
            path: '',
            component: ProfileComponent
        }
    ])
]
```

(esse é um teste seguindo o tutorial do Café com bug https://www.youtube.com/watch?v=9tZrDWY4qyE&t=537s)

## configurar a aplicação host
No webpack do host-app, descomentar o `// For hosts (please adjust)` e apontar para o remoteEntry.js do mfe, então ficaria: `<nomeApp>@<dominio>/remoteEntry.js`

No output -> scriptType também tem que setar javascript. Comentar também o `type: 'module'` nos dois webpacks, não usaremos.

Criar um componente no host
`ng g c home --project=host-app` e configurar a rota da home

Configurar também a rota do profile que vai carregar o microfrontend (mfe)
```javascript
{
    path: 'profile',
    loadChildren: () => loadRemoteModule({
      remoteEntry: 'http://localhost:4201/remoteEntry.js',
      remoteName: 'mfeApp',
      exposedModule: './ProfileModule'
    }).then((m) => m.ProfileModule).catch(err => console.log(err))
  }
```

A requisição pro mfe é feita uma única vez, depois cacheia





