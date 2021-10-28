export async function get(path) {
  return fetch(`/api/${path}`, {
    headers: new Headers({
      'Accept': 'application/json'
    })
  }).then(parseResponse);
}

export async function post(path, body) {
  return fetch(`/api/${path}`, {
    method: 'POST',
    body: body === undefined ? body : JSON.stringify(body),
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    })
  }).then(parseResponse);
}

export async function del(path, body) {
  return fetch(`/api/${path}`, {
    method: 'DELETE',
    body: body === undefined ? body : JSON.stringify(body),
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    })
  }).then(parseResponse);
}

async function parseResponse(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
