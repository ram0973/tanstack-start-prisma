console.log('running');

export const getJson = async (url: string, options: object) => {
  const jsonOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const response: Response = await fetch(url, {...options, ...jsonOptions});
  console.log(JSON.stringify(response));
  let json = null;
  if (response.ok) {
    // если HTTP-статус в диапазоне 200-299
    let json = response.json();
    console.log(response.json());
  }
  let status = response.status;
  return { response, json, status };
};
export const api = {
  getJson,
};
const result = await api.getJson('http://localhost/api/auth/ok', {});
console.log(JSON.stringify(result));

fetch('http://localhost/api/auth/ok2')
//.then(res => res.json())
//.then(res => res.map(user => user.username))
//.then(userNames => console.log(userNames));
.then(res => console.log(res))
.catch(error => console.log(error))
