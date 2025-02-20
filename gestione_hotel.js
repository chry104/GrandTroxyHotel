const users = [
    { username: "admin", password: "admin123", role: "admin" },
    { username: "user", password: "user123", role: "user" }
];

function login(username, password) {
    try {
        if (!username || !password) {
            throw new Error("Username e password sono obbligatori");
        }

        const user = users.find(u => u.username === username && u.password === password);
        
        if (!user) {
            throw new Error("Credenziali errate");
        }

        console.log(`Login effettuato con successo! Ruolo: ${user.role}`);
        return user;
    } catch (error) {
        console.error(`Errore: ${error.message}`);
    }
}

// Esempi di utilizzo
login("admin", "admin123"); // Login corretto
login("user", "user123");  // Login corretto
login("user", "wrongpass"); // Errore: Credenziali errate
login("", ""); // Errore: Username e password sono obbligatori