// functions/verify-recaptcha.ts
import { Handler } from '@netlify/functions';
import axios from 'axios';

// Interface per la richiesta
interface RecaptchaRequestBody {
  token: string;
  action?: string;
}

// Interface per la risposta da Google
interface RecaptchaVerifyResponse {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

// Interface per la nostra risposta
interface FunctionResponse {
  success: boolean;
  score?: number;
  isHuman?: boolean;
  message?: string;
  errors?: string[];
}

// Handler della funzione Netlify
const handler: Handler = async (event) => {
  // Abilita CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json',
      } as { [header: string]: string | number | boolean },
      body: '',
    };
  }

  // Verifica che sia una richiesta POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
      } as { [header: string]: string | number | boolean },
      body: 'Method Not Allowed',
    };
  }

  try {
    // Estrai il token dal corpo della richiesta
    const requestBody = JSON.parse(event.body || '{}') as RecaptchaRequestBody;
    const token = requestBody.token;

    if (!token) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
        } as { [header: string]: string | number | boolean },
        body: JSON.stringify({
          success: false,
          message: 'Token mancante',
        } as FunctionResponse),
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
        } as { [header: string]: string | number | boolean },
        body: JSON.stringify({
          success: false,
          message: 'Errore di configurazione del server',
        } as FunctionResponse),
      };
    }

    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${token}`;

    const response = await axios.post<RecaptchaVerifyResponse>(verificationURL);
    const data = response.data;

    // Controlla la risposta
    if (data.success) {
      // Verifica superata, ma controlla anche il punteggio
      const functionResponse: FunctionResponse = {
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
        } as { [header: string]: string | number | boolean },
        body: JSON.stringify(functionResponse),
      };
    } else {
      // Verifica fallita
      const functionResponse: FunctionResponse = {
        success: false,
        message: 'Verifica reCAPTCHA fallita',
        errors: data['error-codes'],
      };

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        } as { [header: string]: string | number | boolean },
        body: JSON.stringify(functionResponse),
      };
    }
  } catch (error) {
    console.error('Errore nella verifica reCAPTCHA:', error);

    const functionResponse: FunctionResponse = {
      success: false,
      message: 'Errore interno durante la verifica',
    };

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      } as { [header: string]: string | number | boolean },
      body: JSON.stringify(functionResponse),
    };
  }
};

export { handler };
