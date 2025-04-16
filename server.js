const express = require('express');
const fs = require('fs');
const crypto = require('crypto');
const cors = require('cors'); // Importa CORS

const app = express();

// Abilita CORS per tutte le richieste
app.use(cors());
app.use(express.json());
/*
PER AVVIARE IL SERVER SCRIVERE IN CMD NELLA CARTELLA DEL SITO: NODE SERVER.JS
*/

const filePath = './privato/data/javascriptimpiccatiFenoli.csv';


if (!fs.existsSync('./privato/data')) {
    fs.mkdirSync('./privato/data', { recursive: true });
}

// 📌 Controlla se il file CSV esiste, altrimenti lo crea con intestazione
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "id,emailHash,passwordHash,nome,cognome,data_nascita,telefono\n");
}



function checkEmailExists(emailHash, callback) {
    fs.readFile('./privato/data/javascriptimpiccatiFenoli.csv', 'utf8', (err, data) => {
        if (err) {
            return callback(err, null);
        }
        const lines = data.split('\n');
        const users = lines.map(line => line.split(',')[0]); // Ottieni gli hash delle email dal CSV
        const emailExists = users.includes(emailHash);
        callback(null, emailExists);
    });
}
function generateUserId() {
    return crypto.randomUUID(); // Genera un ID univoco
}

app.post('/register', (req, res) => {
    const { name, lastname, date, phone, email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Dati mancanti!' });
    }

    // Genera gli hash SHA-256
    const emailHash = crypto.createHash('sha256').update(email).digest('hex');
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    checkEmailExists(emailHash, (err, emailExists) => {
        if (err) {
            return res.status(500).json({ message: "Errore durante la lettura del file!" });
        }

        if (emailExists) {
            return res.status(400).json({ message: "Email già registrata!" });
        }





        const userId = generateUserId();




        //  const entry = `${emailHash},${passwordHash}\n`;
        const entry = `${userId},${emailHash},${passwordHash},${name},${lastname},${date},${phone}\n`;



        // Scrive in modo sicuro nel file CSV
        //const filePath = 'C:\\Users\\User\\Desktop\\cartella_programmi\\ProgrammaHotel\\sito2\\privato\\data\\javascriptimpiccatiFenoli.csv'; // Windows
        // const filePath = '.\\privato\\data\\javascriptimpiccatiFenoli.csv';
        /*
         fs.appendFile(filePath, entry, (err) => {
             if (err) {
                 console.error("❌ Errore scrittura CSV:", err);
                 return res.status(500).json({ message: 'Errore nella registrazione!' });
             }
             console.log("✅ Dati salvati nel CSV con successo!");
             return res.status(200).json({ message: 'Registrazione completata con successo!' });
         });
         */
        fs.readFile(filePath, 'utf8', (err, data) => {
            const hasHeader = data.startsWith("id,emailHash,passwordHash,nome,cognome,data_nascita,telefono");

            // Riga da salvare nel CSV
            const entry = `${userId},${emailHash},${passwordHash},${name},${lastname},${date},${phone}\n`;

            // Se il file è vuoto o senza intestazione, scrivila
            const dataToWrite = hasHeader ? entry : `id,emailHash,passwordHash,nome,cognome,data_nascita,telefono\n${entry}`;

            fs.appendFile(filePath, dataToWrite, (err) => {
                if (err) {
                    console.error("❌ Errore scrittura CSV:", err);
                    return res.status(500).json({ message: 'Errore nella registrazione!' });
                }
                console.log("✅ Dati salvati nel CSV con successo!");
                return res.status(200).json({ message: 'Registrazione completata con successo!' });
            });
        });
    });
});

app.listen(3000, () => console.log('✅ Server avviato su http://localhost:3000'));

