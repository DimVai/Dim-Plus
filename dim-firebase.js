let App = window.App;

/** Returns the user, whenever becomes available (or null if logged off) */
App.user ??= () => {
    return new Promise((resolve, reject) => {
       const unsubscribe = firebase.auth().onAuthStateChanged(user => {
          unsubscribe();
          resolve(user);
       }, reject);
    });
};
App.user.token ??= async (forceRefresh=false) => {
    let user = await App.user();
    return await user.getIdToken(forceRefresh);
};
App.user.claims ??= async (claim=null) => {
    let user = await App.user();
    return claim ? (await user.getIdTokenResult()).claims[claim] : (await user.getIdTokenResult()).claims;
};
