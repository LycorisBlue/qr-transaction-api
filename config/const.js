class Consts{

    //SYSTEM
    static PORT_SYSTEM = 3000
    static APP_NAME = "Stasis-Project"
    static APP_AUTHOR = "LycorisBlue"

    //PAGINATION
    static NLIMIT = 10

    //DEFAULT PARAMS
    static DEFAULT_USER_CONFIRMATION_EXPIRATION = 3; // months
    static DEFAULT_USER_RESET_EXPIRATION = 15; // minutes

    static DEFAULT_DESC_APIKEY_BACKOFFICE = "BackOffice System API Key";
    static DEFAULT_VALUE_APIKEY_BACKOFFICE = "8DNICBX4JBMY89FATTZJ1FTDEOR2QFQN";
    static DEFAULT_PASSWORD_BACKOFFICE = "12345678";

    static DEFAULT_DESC_APIKEY_MOBILE = "Mobile System API Key";
    static DEFAULT_VALUE_APIKEY_MOBILE = "XRKHP9FQIZZ0EQKPOBD0GI4C4X9LAKJ9";
    static DEFAULT_PASSWORD_MOBILE = "12345678";

    static DEFAULT_MESSAGE_USER_SYSTEM = 0;
    static DEFAULT_MESSAGE_USER_CLIENT = 1;

    static DEFAULT_ADMINS = [
        {
            username: "admin@hermes.com",
            password: "12345678",
            firstname: "Admin",
            lastname: "Hermes"
        }
    ]
}

module.exports = Consts;

