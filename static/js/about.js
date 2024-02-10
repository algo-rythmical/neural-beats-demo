fetch('static/text-files/about-NB.txt')
  .then(response => response.text())
  .then(data => {
    document.querySelector('.about-NB').innerText = data;
  });

fetch('static/text-files/how-it-works.txt')
  .then(response => response.text())
  .then(data => {
    document.querySelector('.how-it-works').innerText = data;
  });

fetch('static/text-files/technology.txt')
  .then(response => response.text())
  .then(data => {
    document.querySelector('.technology').innerText = data;
  });


fetch('static/text-files/join.txt')
  .then(response => response.text())
  .then(data => {
    document.querySelector('.join').innerText = data;
  });