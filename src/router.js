import { Router } from '@vaadin/router';

let router;

export function initRouter(outlet) {
  if (!outlet) {
    throw new Error('Outlet element is required for router initialization');
  }

  router = new Router(outlet);
  
  router.setRoutes([
    {
      path: '/',
      redirect: '/login-page'
    },
    {
      path: '/employees',
      component: 'employee-list',
      action: async () => {
        await import('./pages/employee-list.js');
      }
    },
    {
      path: '/login-page',
      component: 'login-page',
      action: async () => {
        await import('./pages/login-page.js');
      }
    },
    {
      path: '(.*)',
      component: 'not-found-view',
      action: async () => {
        await import('./pages/not-found-view.js');
      }
    }
  ]);

  return router;
}

export { router }; 