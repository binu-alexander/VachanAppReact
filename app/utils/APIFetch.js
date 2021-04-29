import store from '../store/'
import ApiUtils from './ApiUtils'

class vApi {
  static get(url) {
    const requestParams = {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    const state = store.getState()
    if(state.updateVersion.baseAPI != null){
    // state.updateVersion.baseAPI
      return fetch('https://www.api.vachanonline.net/v1/' + url, requestParams)
        .then(ApiUtils.checkStatus)
        .then(response => {
          return response.json();
        })
        .catch(error => {
          return error;
        });
    }
  }
}

export default vApi;
