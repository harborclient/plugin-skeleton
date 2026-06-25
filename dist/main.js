// src/main.ts
function activate(hc) {
  hc.subscriptions.push(
    hc.http.onAfterSend(
      (request, response) => {
        console.log(
          `[skeleton] ${response.status} ${request.method} ${request.url}`
        );
      }
    )
  );
}
export {
  activate
};
