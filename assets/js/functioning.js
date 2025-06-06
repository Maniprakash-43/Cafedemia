// --- Authentication Part --- 
var firebaseConfig = {
  apiKey: "AIzaSyDBn5GMIvsqhTPMVAeylq-I_2R8SSJYzmI",
  authDomain: "js-login-form.firebaseapp.com",
  projectId: "js-login-form",
  storageBucket: "js-login-form.appspot.com",
  messagingSenderId: "1039987076182",
  appId: "1:1039987076182:web:e51f940647b55c0cd7dff7",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Helper to create unique User ID
function makeUserDataID(userEmailID) {
  let userDataID = '';
  for (let i = 0; i < userEmailID.length; i++) {
    if (userEmailID[i] !== '@') userDataID += userEmailID[i];
    else break;
  }
  return userDataID;
}

// Save Data - To Firebase Realtime Database
class saveDatabase {
  static UserfirebaseDatabase(userName, email, password, phoneNumber) {
    const userID = makeUserDataID(email);
    firebase
      .database()
      .ref('User_Data/' + userID)
      .set({
        User_Name: userName,
        Email: email,
        Password: password,
        Phone_Number: phoneNumber,
      });
  }
}

// Sign Up Methods
class signUpMethods {
  // === Email/Password Sign‐Up ===
  builtInSignUp() {
    // Instead of using `myForm[...]`, select each input by its ID:
    const userName = document.getElementById("sign-up-full-name").value.trim();
    const email = document.getElementById("sign-up-email").value.trim();
    const password = document.getElementById("sign-up-password").value;
    const repassword = document.getElementById("sign-up-repassword").value;
    const phoneNumber = document.getElementById("sign-up-number").value.trim();

    // Basic validation
    if (password === '' || password !== repassword) {
      Swal.fire('Re-entered password is not the same as the entered password or field is empty');
      return;
    }
    if (phoneNumber.length !== 10 || !/^\d{10}$/.test(phoneNumber)) {
      Swal.fire('Phone number is not valid');
      return;
    }

    // Create user with Firebase Auth
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((cred) => {
        // Save extra user info to Realtime Database
        saveDatabase.UserfirebaseDatabase(userName, email, password, phoneNumber);
        // Show success alert
        Swal.fire({
          icon: 'success',
          title: 'Account Created Successfully. Redirecting to login...',
          timer: 2000,
          showConfirmButton: false
        });
        // Redirect after a short delay
        signUpMethods.authRedirecting();
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: error.message
        });
      });
  }

  // === Social Sign‐In / Sign‐Up (Google, Facebook, GitHub) ===
  googleSignUpIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(() => {
        this.notifyUser();
        this.firebaseAuthRedirect();
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: error.message
        });
      });
  }

  facebookSignUpIn() {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(() => {
        this.notifyUser();
        this.firebaseAuthRedirect();
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: error.message
        });
      });
  }

  githubSignUpIn() {
    const provider = new firebase.auth.GithubAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then(() => {
        this.notifyUser();
        this.firebaseAuthRedirect();
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: error.message
        });
      });
  }

  // After a short timeout, redirect to client‐side page
  static authRedirecting() {
    setTimeout(() => {
      window.location.replace('https://cafedemia.netlify.app/client-side.html');
    }, 500);
  }

  // Notify user of success (used by social sign‐in)
  notifyUser() {
    setTimeout(() => {
      Swal.fire({
        icon: 'success',
        title: 'Signed in successfully',
        timer: 1500,
        showConfirmButton: false
      });
    }, 1250);
  }

  // Attach onAuthStateChanged listener; when user is signed in, redirect
  firebaseAuthRedirect() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        window.location.replace('https://cafedemia.netlify.app/client-side.html');
      }
    });
  }
}

// Sign In Methods
class signInMethods {
  builtInSignIn() {
    const email = document.getElementById('sign-in-email').value.trim();
    const password = document.getElementById('sign-in-password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Logged In',
          timer: 1500,
          showConfirmButton: false
        });
        signUpMethods.authRedirecting();
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: error.message
        });
      });
  }
}

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  // Grab forms/buttons by their IDs
  const signUpForm = document.getElementById("main-form");
  const signInForm = document.getElementById("signIn-form");
  const googleButtons = document.querySelectorAll("#google-signUpIn");
  const githubButtons = document.querySelectorAll("#github-signUpIn");
  const facebookButtons = document.querySelectorAll("#facebook-signUpIn");
  const logoutButtons = document.querySelectorAll('#userlogout');

  const signUp = new signUpMethods();
  const signIn = new signInMethods();

  // Email/Password Sign Up listener
  if (signUpForm) {
    signUpForm.addEventListener("submit", (e) => {
      e.preventDefault();
      signUp.builtInSignUp();
    });
  }

  // Email/Password Sign In listener
  if (signInForm) {
    signInForm.addEventListener("submit", (e) => {
      e.preventDefault();
      signIn.builtInSignIn();
    });
  }

  // Google Sign‐In listener
  if (googleButtons.length) {
    googleButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        signUp.googleSignUpIn();
      });
    });
  }

  // GitHub Sign‐In listener
  if (githubButtons.length) {
    githubButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        signUp.githubSignUpIn();
      });
    });
  }

  // Facebook Sign‐In listener
  if (facebookButtons.length) {
    facebookButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        signUp.facebookSignUpIn();
      });
    });
  }

  // Logout listener
  if (logoutButtons.length) {
    logoutButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        firebase.auth().signOut()
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Logged Out Successfully',
              timer: 1500,
              showConfirmButton: false
            });
            setTimeout(() => {
              window.location.replace("https://cafedemia.netlify.app/index.html");
            }, 1000);
          })
          .catch(error => {
            Swal.fire({
              icon: 'error',
              title: error.message
            });
          });
      });
    });
  }

  // “Your Orders” button logic
  const yourOrdersBtn = document.getElementById('yourOrdersBtn');
  const ordersContainer = document.getElementById('ordersContainer');

  if (yourOrdersBtn && ordersContainer) {
    yourOrdersBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const user = firebase.auth().currentUser;
      if (!user) {
        Swal.fire({
          icon: 'warning',
          title: 'Please log in to view your orders.',
        });
        return;
      }

      const userID = user.uid;
      firebase.database().ref('Orders/' + userID).once('value', snapshot => {
        const orders = snapshot.val();
        ordersContainer.innerHTML = ''; // Clear previous results

        if (!orders) {
          ordersContainer.innerHTML = '<p>No orders found.</p>';
          return;
        }

        Object.values(orders).forEach(order => {
          const div = document.createElement('div');
          div.className = 'order-card';
          div.innerHTML = `
            <p><strong>Items:</strong> ${order.items.join(', ')}</p>
            <p><strong>Total:</strong> ₹${order.total}</p>
            <p><strong>Date:</strong> ${new Date(order.timestamp).toLocaleString()}</p>
          `;
          ordersContainer.appendChild(div);
        });
      });
    });
  }
});
