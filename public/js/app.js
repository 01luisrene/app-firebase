
(function(){
// Initialize Firebase
const config = {
  apiKey: "AIzaSyBA4_ffiZh2oSdcwsHPnGoHOhcx7R6nSnQ",
  authDomain: "recorderis-174c3.firebaseapp.com",
  databaseURL: "https://recorderis-174c3.firebaseio.com",
  storageBucket: "recorderis-174c3.appspot.com",
  messagingSenderId: "192864117964"
};
firebase.initializeApp(config);

//Obtener elementos
const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const btnLogin = document.getElementById('btnLogin');
const btnSignUp = document.getElementById('btnSignUp');
const btnLogout = document.getElementById('btnLogout');
const btnGitHub = document.getElementById('btnGitHub');

//Contenedores
const metaUser = document.getElementById('metaUser');
const formularioLoginRegistro = document.getElementById('formularioLoginRegistro');

//Elemntos de formulario guardar actualizar y eliminar registros DB
const txtTituloRecorderis =  document.getElementById('txtTituloRecorderis');
const dateRecorderis = document.getElementById('dateRecorderis');
const txtaDescripcionRecorderis = document.getElementById('txtaDescripcionRecorderis');
const btnEnviar = document.getElementById('btnEnviar');

//Añadir evento login
btnLogin.addEventListener('click', e =>{
	//Obtener email y pass
	const email = txtEmail.value;
	const pass = txtPassword.value;
	const auth = firebase.auth();
	//Sign in
	const promise = auth.signInWithEmailAndPassword(email, pass);
	promise.catch(e => console.log(e.message));

});

//Añadir evento login
btnSignUp.addEventListener('click', e =>{
	//Obtener email y pass
	//TODO: comprobar que el email sea real
	const email = txtEmail.value;
	const pass = txtPassword.value;
	const auth = firebase.auth();
	//Sign in
	const promise = auth.createUserWithEmailAndPassword(email, pass);
	promise.catch(e => console.log(e.message));

});

//Añadir evento logout
btnLogout.addEventListener('click', e =>{
	firebase.auth().signOut();
});

//Añadir un listerer en tiempo real
firebase.auth().onAuthStateChanged( firebaseUser => {
	const user = firebase.auth().currentUser;
	var email;
	var uid;

	if(firebaseUser){
		email = user.email;
		uid = user.uid;
		const emailFormateado = email.replace(/[@.]/g, '-');
		const ref = `${emailFormateado}_${uid}`;

		document.getElementById('email').innerHTML = `<b>Usuario</b>: ${email}`;
		console.log('Usuario logueado: ' + email);
		metaUser.classList.remove('hide');
		formularioLoginRegistro.classList.add('hide');

		//Escribir datos en la DB
		btnEnviar.addEventListener('click', e =>{
			//Obtener datos
			const title =  txtTituloRecorderis.value;
			const description = txtaDescripcionRecorderis.value;
			const date = dateRecorderis.value;
			var newPostKey = firebase.database().ref().child('posts').push().key

			firebase.database().ref(ref).push({
		    title: title,
		    description: description,
		    date : date
		  });
		});

		//Obterner elementos
		const objeto = document.getElementById('objeto');
		const ulList = document.getElementById('lista');
		//Crear referencias
		const dbRefObject = firebase.database().ref().child(ref);
		const dbRefList = firebase.database().ref().child(ref);

		//Sincronizar cambio de objetos
		dbRefObject.on('value', snap =>{
			objeto.innerText = JSON.stringify(snap.val(), null, 3)
		});

		//Sincronizar cambios en una lista
		dbRefList.on('child_added', snap =>{
			const li = document.createElement('li');
			li.innerText = snap.key;
			li.id = snap.key;
			ulList.appendChild(li);
		});

		dbRefList.on('child_changed', snap =>{
			const liChanged = document.getElementById(snap.key);
			liChanged.innerText = snap.val();
		});

		dbRefList.on('child_removed', snap =>{
			const liToRemove = document.getElementById(snap.key);
			liToRemove.remove();
		});

	}else{
		document.getElementById('email').innerHTML = '';
		console.log('no logueado');
		metaUser.classList.add('hide');
		formularioLoginRegistro.classList.remove('hide');
	}

});

}());