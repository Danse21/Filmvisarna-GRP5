namespace WebApp;

// The Password helper class contains methods for securely
// hashing and verifying user passwords.
//
// Passwords should NEVER be stored as plain text in a database.
// Instead, they are hashed using a cryptographic algorithm.
// This class uses the BCrypt algorithm to safely store passwords.
static class Password
{
    // Cost (also called work factor) controls how computationally expensive
    // the hashing process is.
    //
    // A higher number means:
    // - stronger security against brute-force attacks
    // - but slower hashing
    //
    // Value 13 is considered strong while still acceptable for login performance.
    private static int Cost = 13;

    // Encrypt() hashes a plain text password before storing it in the database.
    //
    // Example flow during user registration:
    // 1. User enters password in the registration form
    // 2. Backend calls Encrypt(password)
    // 3. The hashed result is stored in the database
    //
    // The original password is never stored.
    public static string Encrypt(string password)
    {
        return BCryptNet.EnhancedHashPassword(password, workFactor: Cost);
    }

    // Verify() checks whether a plain text password matches
    // a previously hashed password stored in the database.
    //
    // Example flow during login:
    // 1. User enters password
    // 2. Backend retrieves hashed password from database
    // 3. Verify() compares them securely
    //
    // BCrypt automatically applies the same hashing process and
    // compares the result safely.
    public static bool Verify(string password, string encrypted)
    {
        return BCryptNet.EnhancedVerify(password, encrypted);
    }
}