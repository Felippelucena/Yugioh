export async function buscarDados(path) {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/${path}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  }

export async function login(user) {

  }