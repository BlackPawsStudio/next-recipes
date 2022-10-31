import { RecipesGroupType } from './data';
import { RecipeType } from './data';
import { NextApiRequest, NextApiResponse } from 'next';

let recipesGroups: RecipesGroupType[] = [];

const getLowestId = (id: number, arr: any[]): number =>
  arr.find((el) => el.id === id) ? getLowestId(++id, arr) : id;

const updateData = async () => {
  await fetch('https://next-recipe-db-default-rtdb.europe-west1.firebasedatabase.app/.json', {
    method: 'PUT',
    headers: {
      'Content-type': 'application-json',
    },
    body: JSON.stringify(recipesGroups),
  });
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<RecipeType | RecipesGroupType[] | string>
) => {
  const { groupId, id } = req.query;
  const dbResponse = await fetch(
    'https://next-recipe-db-default-rtdb.europe-west1.firebasedatabase.app/.json'
  );
  const data = await dbResponse.json();
  if (typeof data === 'undefined' || data === null) {
    recipesGroups = [];
  } else {
    const newData: RecipesGroupType[] = Object.values(data);
    newData.forEach((el) => {
      if (typeof el.recipes === 'undefined') {
        console.log('a');

        el.recipes = [];
      } else {
        el.recipes.forEach((el) => {
          if (typeof el.ingredients === 'undefined') {
            el.ingredients = [];
          }
        });
      }
    });
    recipesGroups = data;
  }
  console.log(recipesGroups);
  switch (req.method) {
    case 'POST':
      if (groupId) {
        const data = req.body;
        if (id) {
          const recipesGroup = recipesGroups.find((el) => el.id === +groupId);
          if (recipesGroup) {
            const lowestID = recipesGroup?.recipes ? getLowestId(0, recipesGroup.recipes) : 0;
            data.id = lowestID;
            if (recipesGroup) {
              recipesGroup.recipes.push(data);
              await updateData();
              res.status(201).send(recipesGroups);
            } else res.status(404).send('Not found');
          } else res.status(404).send('Not found');
        } else {
          const lowestID = getLowestId(0, recipesGroups);
          data.id = lowestID;
          recipesGroups.push(data);
        }
        console.log('entry added', recipesGroups);
        await updateData();
        res.status(201).send(recipesGroups);
      } else res.status(400).send('Bad request');
      break;
    case 'GET':
      if (typeof groupId === 'string' && typeof id === 'string') {
        const recipesGroup = recipesGroups.find((el) => el.id === +groupId);
        if (recipesGroup) {
          const recipe = recipesGroup.recipes.find((el) => el.id === +id);
          if (recipe) {
            res.status(200).send(recipe);
            console.log('get recipe', recipe);
          } else res.status(404).send('Not found');
        } else res.status(404).send('Not found');
      } else {
        res.status(200).send(recipesGroups);
        console.log('get all recipes');
      }
      break;
    case 'PUT':
      if (typeof groupId === 'string' && typeof id === 'string') {
        const data = req.body;
        const recipesGroup = recipesGroups.find((el) => el.id === +groupId);
        if (recipesGroup) {
          const recipe = recipesGroup.recipes.find((el) => el.id === +id);
          if (recipe) {
            const recipeId = recipesGroup.recipes.indexOf(recipe);
            recipesGroup.recipes = data;
            console.log('entry updated', recipesGroups);
            await updateData();
            res.status(202).send(recipesGroups);
          } else res.status(404).send('Not found');
        } else res.status(404).send('Not found');
      } else res.status(400).send('Bad request');
      break;
    case 'DELETE':
      if (typeof groupId === 'string') {
        const recipesGroup = recipesGroups.find((el) => el.id === +groupId);
        if (recipesGroup) {
          if (typeof id === 'string') {
            const recipe = recipesGroup.recipes.find((el) => el.id === +id);
            if (recipe) {
              const recipeId = recipesGroup.recipes.indexOf(recipe);
              recipesGroup.recipes.splice(recipeId, 1);
              await updateData();
              res.status(202).send('Deleted');
              console.log('delete', recipe, 'from', recipesGroup);
            } else res.status(404).send('Not found');
          } else {
            const recipesGroupId = recipesGroups.indexOf(recipesGroup);
            recipesGroups.splice(recipesGroupId, 1);
            await updateData();
            res.status(202).send('Deleted');
            console.log('delete recipe group', recipesGroup);
          }
        } else res.status(404).send('Not found');
      } else res.status(400).send('Bad request');
      break;
  }
  updateData();
};

export default handler;
