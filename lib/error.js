function IDNotFound(message) {
    this.message = (message || "");
    this.name = 'IDNotFound';
}
IDNotFound.prototype = new Error();


function NotFound(message) {
    this.message = (message || "");
    this.name = 'NotFound';
}
NotFound.prototype = new Error();

function requestError(err, response) {
    if (err) return err;
    return new Error("Status code:" + statusCode);
}

module.exports = {
  IDNotFound: IDNotFound,
  NotFound: NotFound,
  requestError: requestError
};
