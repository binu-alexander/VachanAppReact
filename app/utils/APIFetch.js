import store from '../store/'

class vApi {
  static get(url) {
    const requestParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    };
    const state = store.getState()
    return fetch(state.updateVersion.baseAPI + url, requestParams)
      .then(response => {
        return response.json();
      })
      .catch(error => {
        return error;
      });
  }
}

export default vApi;
