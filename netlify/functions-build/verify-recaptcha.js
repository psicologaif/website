"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const axios_1 = __importDefault(require("axios"));
// Handler della funzione Netlify
const handler = async (event) => {
    // Abilita CORS
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Content-Type': 'application/json',
            },
            body: '',
        };
    }
    // Verifica che sia una richiesta POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Content-Type': 'application/json',
            },
            body: 'Method Not Allowed',
        };
    }
    try {
        // Estrai il token dal corpo della richiesta
        const requestBody = JSON.parse(event.body || '{}');
        const token = requestBody.token;
        if (!token) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    success: false,
                    message: 'Token mancante',
                }),
            };
        }
        // Verifica il token con l'API di Google reCAPTCHA
        const recaptchaSecret = process.env['RECAPTCHA_SECRET_KEY'];
        if (!recaptchaSecret) {
            console.error('Chiave segreta reCAPTCHA non configurata');
            return {
                statusCode: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    success: false,
                    message: 'Errore di configurazione del server',
                }),
            };
        }
        const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${token}`;
        const response = await axios_1.default.post(verificationURL);
        const data = response.data;
        // Controlla la risposta
        if (data.success) {
            // Verifica superata, ma controlla anche il punteggio
            const functionResponse = {
                success: true,
                score: data.score,
                // Considera l'azione attendibile se il punteggio è superiore a 0.5
                isHuman: data.score !== undefined ? data.score > 0.5 : true,
            };
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(functionResponse),
            };
        }
        else {
            // Verifica fallita
            const functionResponse = {
                success: false,
                message: 'Verifica reCAPTCHA fallita',
                errors: data['error-codes'],
            };
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(functionResponse),
            };
        }
    }
    catch (error) {
        console.error('Errore nella verifica reCAPTCHA:', error);
        const functionResponse = {
            success: false,
            message: 'Errore interno durante la verifica',
        };
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(functionResponse),
        };
    }
};
exports.handler = handler;
//# sourceMappingURL=verify-recaptcha.js.map