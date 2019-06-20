
function parseJSON(response: Response) {
  const ret = response;

  const validResponse = response.status >= 200 && response.status < 300;

  try {
    return response.json();
  } catch (e) {
    console.error('could not parse response', e); // eslint-disable-line no-console
  }
  if (!validResponse) {
    throw ret;
  }
}

export default function request(_url: string, _options: RequestInit = {}) {
  const defaultHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  const options = {
    ..._options,
  };

  const url = _url;

  options.headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  return fetch(url, options)
    .then(parseJSON);
}

