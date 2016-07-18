function IDNotFound(message) {
    this.message = (message || "");
    this.name = 'IDNotFound';
}
IDNotFound.prototype = new Error();



module.exports = {
  IDNotFound: IDNotFound
};
