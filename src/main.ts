import './style.css';
import _cities from './data/cities.json';
import { FloorPlanEngine } from '@archilogic/floor-plan-sdk';
import { City } from './Types';

const cities = _cities as City[];
const publishableToken = '3226f30c-492c-4816-b6ce-9de1b33edcc0';
const floorId = 'fb2f682f-2fa8-4121-a92b-8d338841c99d';

(async () => {
  const container = document.querySelector<HTMLElement>('#app');
  if (!container) return;
  const floorPlan = new FloorPlanEngine({ container });
  await floorPlan.loadScene(floorId, {
    publishableAccessToken: publishableToken,
  });

  const conferenceRooms = floorPlan.resources.spaces.filter((space) => {
    return space.program === 'meet';
  });

  let len = cities.length,
    taken = new Array(len),
    n = conferenceRooms.length,
    randomCities = new Array(n);

  while (n--) {
    const x = Math.floor(Math.random() * len);
    randomCities[n] = cities[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }

  const conferenceRoomsWithLabels = conferenceRooms.map((room, index) => {
    return { ...room, city: randomCities[index] };
  });

  conferenceRoomsWithLabels.forEach((room) => {
    // Create HTML elements that we can use as room labels
    let el = document.createElement('div');
    let label = document.createElement('span');
    el.className = 'country-label label';

    // Highlight each conference room so they're easily distinguishable from other spaces
    room.node.setHighlight({ fill: [196, 0, 150], fillOpacity: 0.4 });

    // Create a room label with a country flag and a city name
    label.innerHTML =
      '<div class="country-flag">' +
      room.city.emoji +
      '</div><div class="country-name">' +
      room.city.name +
      '</div>';

    // Add the label to the HTML element
    el.appendChild(label);

    // Add the HTML elements to the floor plan as markers
    floorPlan.addHtmlMarker({
      el,
      pos: room.center,
      offset: [0, 0],
    });
  });
})();
