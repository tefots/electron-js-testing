interface User {
    username: string;
    password: string;
  }
  
  export const saveUser = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
  };
  
  export const getUser = (): User | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  };
  
  export const clearUser = () => {
    localStorage.removeItem('user');
  };
  
  export const checkCredentials = (username: string, password: string): boolean => {
    const storedUser = getUser();
    return storedUser ? storedUser.username === username && storedUser.password === password : false;
  };
  