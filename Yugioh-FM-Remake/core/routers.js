export function adicionarRotas(router) {

  router.addRoute('/', {
    template: 'pages/home/home.html',
    script: '../pages/home/home.js'
  });
  router.addRoute('/about', {
    template: 'pages/home/about.html'
  });


  router.addRoute('/user/:id', {
    template: 'pages/user/perfil.html',
    script: '../pages/user/perfil.js'
  });

  
  router.addRoute('/admin', {
    template: 'pages/admin/home.html',
    script: '../pages/admin/home.js'
  });


  router.addRoute('/partida', {
    template: 'pages/partida/partida.html',
    script: '../pages/partida/partida.js'
  });
}