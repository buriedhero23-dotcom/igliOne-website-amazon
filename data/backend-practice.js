const xhr = new XMLHttpRequest();

xhr.addEventListener('load', () => {
  console.log(xhr.response);
});


xhr.open('GET','https://supersimplebackend.dev');
xhr.send();

//закончил на 19.43
/*
const xhr = new XMLHttpRequest();

xhr.addEventListener('load', () => {
  console.log(xhr.response)
});

xhr.open('GET', 'https://supersimplebackend.dev/images/apple.jpg');
xhr.send();
*/