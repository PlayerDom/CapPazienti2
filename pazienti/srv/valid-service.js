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

  

    this.on('READ', 'Pazienti', async req => {
        try {
            const result = await cds.run(req.query);
            return result;
        } catch (error) {
            let errorMessage = createMessage(error)
            LOG.error('Error executing query:', error);
            req.reject(errorMessage.code, errorMessage.message);
        }
    })


    // Gestione degli errori
    this.on('error', (err, req) => {
        console.error("Errore generico:", err);
    });
};
