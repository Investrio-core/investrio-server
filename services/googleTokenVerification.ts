import fetch from 'node-fetch';

export default async (token: string, email: string) => {
  if (!token) {
    return false;
  } 
  const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
    
  if (response.status !== 200) {
    return false;
  }

  const userData = await response.json();

  if (userData.email === email) {
    return true;
  }

  return false;
};
