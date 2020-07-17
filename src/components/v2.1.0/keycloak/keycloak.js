import Keycloak from 'keycloak-js'
 
// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
const keycloak = new Keycloak({ 
  url: 'http://192.168.11.181:8100/auth/', 
  realm: 'KG_CORP', 
  clientId: 'workforce-management' });
 
export default keycloak;