import PageLogin from './pages/Login/PageLogin.vue'

const routes = [
  {
    
  },
  {
    path: '/login',
    name: 'login',
    component: PageLogin,
    meta: {
      publicPage: true,
      title: 'Login',
    },
  }
]

export default routes



