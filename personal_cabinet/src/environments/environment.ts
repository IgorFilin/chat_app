export let environment = {
  production: false,
  apiBaseUrl: '',
};

if (environment.production) {
  environment = {
    ...environment,
    apiBaseUrl: 'https://filin-hub.online/api',
  };
} else {
  environment = {
    ...environment,
    apiBaseUrl: 'http://localhost:3000',
  };
}
