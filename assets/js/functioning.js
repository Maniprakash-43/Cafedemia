// --- Firebase Config & Initialization ---
var firebaseConfig = {
  apiKey: "AIzaSyDBn5GMIvsqhTPMVAeylq-I_2R8SSJYzmI",
  authDomain: "js-login-form.firebaseapp.com",
  projectId: "js-login-form",
  storageBucket: "js-login-form.appspot.com",
  messagingSenderId: "1039987076182",
  appId: "1:1039987076182:web:e51f940647b55c0cd7dff7",
};
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

// Save user info to Realtime DB
class saveDatabase {
  static UserfirebaseDatabase(userName, email, password, phoneNumber) {
    const userID = makeUserDataID(email);
    firebase.database().ref('User_Data/' + userID).set({
      User_Name: userName,
      Email: email,
      Password: password,
      Phone_Number: phoneNumber,
    });
  }
}

// SignUp Class
class signUpMethods {
  builtInSignUp() {
    const userName = document.getElementById("sign-up-full-name").value.trim();
    const email = document.getElementById("sign-up-email").value.trim();
    const password = document.getElementById("sign-up-password").value;
    const repassword = document.getElementById("sign-up-repassword").value;
    const phoneNumber = document.getElementById("sign-up-number").value.trim();

    if (password === '' || password !== repassword) {
      Swal.fire('Re-entered password is not the same as the entered password or field is empty');
      return;
    }
    if (phoneNumber.length !== 10 || !/^\d{10}$/.test(phoneNumber)) {
      Swal.fire('Phone number is not valid');
      return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((cred) => {
        saveDatabase.UserfirebaseDatabase(userName, email, password, phoneNumber);
        Swal.fire({
          icon: 'success',
          title: 'Account Created Successfully. Redirecting to login...',
          timer: 2000,
          showConfirmButton: false
        });
        signUpMethods.authRedirecting();
      })
      .catch((error) => {
        Swal.fire({ icon: 'error', title: error.message });
      });
  }

  static authRedirecting() {
    setTimeout(() => {
      window.location.replace('https://cafedemia.netlify.app/client-side.html');
    }, 500);
  }
}

// SignIn Class
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

// Function to place order and redirect
function placeOrder(orderData) {
  const user = firebase.auth().currentUser;
  if (!user) {
    Swal.fire({
      icon: 'warning',
      title: 'Please log in to place an order.',
    });
    return;
  }

  const userID = user.uid;
  const ordersRef = firebase.database().ref('Orders/' + userID);

  const orderWithTimestamp = {
    ...orderData,
    timestamp: Date.now()
  };

  ordersRef.push(orderWithTimestamp)
    .then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Order placed successfully!',
        timer: 1500,
        showConfirmButton: false
      });
      setTimeout(() => {
        window.location.href = 'https://cafedemia.netlify.app/user-orders.html'; // Change if needed
      }, 1600);
    })
    .catch((error) => {
      Swal.fire({
        icon: 'error',
        title: 'Order failed: ' + error.message,
      });
    });
}

// DOMContentLoaded to setup event listeners
document.addEventListener("DOMContentLoaded", () => {
  const signUpForm = document.getElementById("main-form");
  const signInForm = document.getElementById("signIn-form");
  const orderBtn = document.getElementById("orderBtn");

  const signUp = new signUpMethods();
  const signIn = new signInMethods();

  if (signUpForm) {
    signUpForm.addEventListener("submit", (e) => {
      e.preventDefault();
      signUp.builtInSignUp();
    });
  }

  if (signInForm) {
    signInForm.addEventListener("submit", (e) => {
      e.preventDefault();
      signIn.builtInSignIn();
    });
  }

  if (orderBtn) {
    orderBtn.addEventListener('click', (e) => {
      e.preventDefault();

      // Example: Collect order data (you need to customize this part)
      const items = ['Coffee', 'Sandwich'];  // Replace with your actual order items
      const total = 250;                     // Replace with actual total price

      const orderData = {
        items: items,
        total: total
      };

      placeOrder(orderData);
    });
  }
});
