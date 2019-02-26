import films from './fixtures/films.json';
import people from './fixtures/people.json';
import planets from './fixtures/planets.json';
import species from './fixtures/species.json';
import starships from './fixtures/starships.json';
import transport from './fixtures/transport.json';
import vehicles from './fixtures/vehicles.json';


function byName (a, b) {
  if (a.fields.name > b.fields.name) return -1;
  if (b.fields.name > a.fields.name) return 1;
  return 0;
}

export default app => {
  app.use((req, res, next) => {

    const ss = starships
      .map(item => {
        const tr = transport.find(i => i.pk == item.pk)
        return { ...item, ...tr };
      })
      .sort(byName);

    

    res.locals.db = {
      films,
      people,
      planets,
      species,
      starships: ss,
      vehicles,
    }
    next();
  });
};