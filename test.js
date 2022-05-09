// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDkvVOelL_KV68pCvZ-3nAlE8qOr_ykwh4",
  authDomain: "test-b88ac.firebaseapp.com",
  databaseURL: "https://test-b88ac-default-rtdb.firebaseio.com",
  projectId: "test-b88ac",
  storageBucket: "test-b88ac.appspot.com",
  messagingSenderId: "219851739449",
  appId: "1:219851739449:web:cfa5c47ee97408631918e8"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize variables
const auth = firebase.auth()
const database = firebase.database()
const db = firebase.firestore()
const storage = firebase.storage();

// Set up register function 
function register () {
  // Get all our input fields
  email = document.getElementById('email').value
  password = document.getElementById('password').value
  first_name = document.getElementById('first name').value
  last_name= document.getElementById('last name').value
  username  = document.getElementById('username').value

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is not valid')
    return 
    
  }
  if (validate_field(first_name) == false || validate_field(last_name) == false || validate_field(username) == false) {
    alert('One or More Extra Fields is not valid')
    return
  }
  
  // Authenticate User
  auth.createUserWithEmailAndPassword(email, password)
  .then(function() {
    // Declare user variable
    var user = auth.currentUser

    // Create User data
    var user_data = {
      email : email, 
      first_name : first_name,
      last_name : last_name,
      username : username,
      last_login: Date.now()
    }

    // Add to database
    db.collection('users').doc(user.uid).set(user_data)
    //Alert user when done
    alert('User was Created! Welcome to JamOut :)')
    location.href='profile.html'
    
  })
  .catch(function(error) {
    // catch an error if found
    var error_code = error.code
    var error_message = error.message

    alert(error_message)
  })
  
  

}

//create login function
function login () {
  // Get all our input fields
  email = document.getElementById('email').value
  password = document.getElementById('password').value

  // Validate input fields
  if (validate_email(email) == false || validate_password(password) == false) {
    alert('Email or Password is invalid')
    return 
    
  }

  auth.signInWithEmailAndPassword(email, password)
  .then(function() {
    // Declare user variable
    var user = auth.currentUser
  
    // Add this user to Firebase Database
    var database_ref = database.ref()

    // Create User data
    var user_data = {
      last_login : Date.now()
    }

    //Add to Firebase 
    db.collection('users').doc(user.uid).update(user_data)
    
    alert("Welcome to JamOut ")
    location.href='profile.html'
    
  })
  .catch(function(error) {
    // catch an error if found
    var error_code = error.code
    var error_message = error.message

    alert(error_message)
  })

  
}


// Validate Functions
function validate_email(email) {
  //create an expression that matches an email setup
  expression = /^[^@]+@\w+(\.\w+)+\w$/
  if (expression.test(email) == true) {
    //email was correct formate
    return true
  } else {
    // Email is not
    return false
  }
}

function validate_password(password) {
  // set minimum password length
  if (password < 6) {
    return false
  } else {
    return true
  }
}

function validate_field(field) {
  //make sure all fields are entered
  if (field == null) {
    return false
  }

  if (field.length <= 0) {
    return false
  } else {
    return true
  }
}

//create save value function
async function saveValues(){
  //get input values
  bio = document.getElementById('bio').value
  favSong = document.getElementById('FavoriteSong').value
  favArtist = document.getElementById('FavArtist').value
  
  //validate if fields were all entered
  if (validate_field(bio) == false || validate_field(favSong) == false || validate_field(favArtist) == false){
    alert("Looks Like one of your fields is missing")
    return
  }
  // create an object
  var user_data = {
      bio : bio,
      favSong : favSong,
      favArtist : favArtist
     
    }
    //add it to the database
  await db.collection('users').doc('ovSkoElDE8ahQcX7UWAUZS3Cpqs2').update(user_data)

  location.href = 'profile.html'

}

//create post function
async function post() {
  //get input values
  var caption = document.getElementById('caption').value;
  var path = document.getElementById('File').value;
  //create the image path
  var imagePath = path.substring(100,12);

  //create object
  var post_data = {
      caption : caption,
      imagePath : imagePath
      
    }
  //add to the data
  db.collection('posts').doc('ovSkoElDE8ahQcX7UWAUZS3Cpqs2').collection("user-posts").doc().set(post_data)

  //alert the user when saved
  alert('Saved')
  
}

//create get image function
async function getImage(){
  //pull the posts from the database
  collectionRef = db.collection('posts').doc('ovSkoElDE8ahQcX7UWAUZS3Cpqs2').collection('user-posts');
  collectionRef2 = await collectionRef.get()
  
    //loop through each element in the database
    collectionRef2.forEach((doc) => {
      
      
      const data = doc.data();
      
        
      
    

  //add each portion of the document to the post class
  // add to the html code
  var postContainer = document.createElement('div');
  postContainer.className = 'post-container';


  var userprofile = document.createElement('img');
  userprofile.className = 'user-profile';
  userprofile.src = "posts/profile pic/headphones.png"
  
  
  userprofile.setAttribute("style", "width: 60px; border-radius: 50%; margin-right: 10px; display: flex;align-items: center;");

  var userName = document.createElement('p');
  userName.className = 'user-profile';
  userName.innerText = "@MarySmith";
  userName.setAttribute('style', "margin-bottom: -5px;font-weight: 500; color: #626262;display: flex;align-items: center;");

  postContainer.appendChild(userprofile);
  postContainer.appendChild(userName); 

  var image = document.createElement('img');
  image.className = 'post-img';
  image.src = "posts/".concat(data.imagePath);;
  //textToAdd = document.createTextNode("testing");

  postContainer.appendChild(image)

  var caption = document.createElement("p");
  caption.className = 'post-text';
  caption.innerText = data.caption;

  postContainer.appendChild(caption); 

  var like = document.createElement('img');
  like.className = 'post-row activity-icons ';
  like.src = "images/like-blue.png";
  like.setAttribute('style', 'display: flex;align-items: center;justify-content: space-between;width: 18px;margin-right:  10px;')
  
  postContainer.appendChild(like)

  //append all the data from above to html
  document.getElementById('POSTCONTAINER').appendChild(postContainer);
  


 });

}

//create get data
async function getData(){
    //get all user info
    docRef = db.collection("users").doc('ovSkoElDE8ahQcX7UWAUZS3Cpqs2');
    docRef.onSnapshot((doc) => {
    if (doc.exists) {
        //get each element fromthe doc and append it to the html code
        const data = doc.data();
        document.getElementById("name").innerText = data.first_name.concat(" ", data.last_name);
        document.getElementById('email').innerText = data.email;
        document.getElementById("name2").innerText = data.first_name.concat(" ", data.last_name);
        document.getElementById('bioText').innerText = data.bio;
        document.getElementById("favSongText").innerText = data.favSong;
        document.getElementById("favArtistText").innerText = data.favArtist;

        //alert(data.email)

     
   
    } else {
        
        console.log("No such document!");
    }
    });
    

  }
  
//set onload to load all the user data and posts
window.onload = function(e){ 

    var data = getData();
    var image = getImage();
    
}


//create signout function
async function signOut(){
  //get user auth and sign them out 
  firebase.auth().signOut().then(() => {
  // Sign-out successful.
  alert("user signed out")
  }).catch((error) => {
  // An error happened.
  });
  location.href = "login.html"
}