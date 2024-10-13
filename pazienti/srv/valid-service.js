const cds = require('@sap/cds');

module.exports = async function () {

    // Gestione dell'autenticazione e autorizzazione
    this.on('READ', 'UserAuthorizations', (req) => {
        return {
            user   : req.user.id,
            isAdmin: req.user.is('admin'),
            isUser:  req.user.is('user')
        };
    });

    // Gestione degli errori
    this.on('error', (err, req) => {
        console.error("Errore generico:", err);
    });
};
