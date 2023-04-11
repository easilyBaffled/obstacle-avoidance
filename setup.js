import './style.css';

const svg = document.querySelector('#field');

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

const [top, left, width, height] = svg
  .getAttribute('viewBox')
  .split(/\s+|,/)
  .map((n) => Number(n));

svg.innerHTML += Array(10)
  .fill(0)
  .map((__, i) => {
    const x = getRandomIntInclusive(25, width - 25);
    const y = getRandomIntInclusive(25, height - 25);

    return `<circle class="obstacle" cx="${x}" cy="${y}" r="10" data-repel="1"></circle>`;
  })
  .join(' ');
