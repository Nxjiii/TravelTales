// Function to check if the user is logged in
export function isUserLoggedIn() {
  return localStorage.getItem("token") !== null;
}

// Middleware to check if the user is authenticated
export function authMiddleware() {
  if (!isUserLoggedIn()) {
    // Display error message instead of redirecting
    alert(
      "You need to log in to complete this action. <a href='/login'>Login here</a>"
    );
  }
}
