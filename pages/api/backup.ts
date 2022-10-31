import { RecipesGroupType } from './data';
import { RecipeType } from './data';
import { NextApiRequest, NextApiResponse } from 'next';

let recipesGroups: RecipesGroupType[] = [];

const getLowestId = (id: number, arr: any[]): number =>
  arr.find((el) => el.id === id) ? getLowestId(++id, arr) : id;

const getAllData = async () => {
  const response = await fetch(
    'https://next-recipe-db-default-rtdb.europe-west1.firebasedatabase.app/.json'
  );
  recipesGroups = Object.values(await response.json()) || [];
};

const updateData = async () => {
  const response = await fetch(
    'https://next-recipe-db-default-rtdb.europe-west1.firebasedatabase.app/.json',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipesGroups),
    }
  );
  console.log(response.status);
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<RecipeType | RecipesGroupType[] | string>
) => {
  const { groupId, id } = req.query;
  switch (req.method) {
    case 'POST':
      getAllData();
      if (groupId) {
        const data = req.body;
        if (id) {
          const recipesGroup = recipesGroups.find((el) => el.id === +groupId);
          if (recipesGroup) {
            const lowestID = getLowestId(0, recipesGroup?.recipes);
            data.id = lowestID;
            if (recipesGroup) {
              recipesGroup.recipes.push(data);
            } else res.status(404).send('Not found');
          } else res.status(404).send('Not found');
        } else {
          const lowestID = getLowestId(0, recipesGroups);
          data.id = lowestID;
          recipesGroups.push(data);
        }
        console.log('entry added', recipesGroups);
        res.status(201).send(recipesGroups);
      } else res.status(400).send('Bad request');
      await updateData();
      break;
    case 'GET':
      if (typeof groupId === 'string' && typeof id === 'string') {
        const response = await fetch(
          `https://next-recipe-db-default-rtdb.europe-west1.firebasedatabase.app/${groupId}/recipes/${id}/.json`
        );
        const recipe = await response.json();
        console.log(recipe, response.status);

        res.status(200).send(recipe);
      } else {
        getAllData();
        res.status(200).send(recipesGroups);
        console.log('get all recipes', recipesGroups);
      }
      break;
    case 'PUT':
      break;
    case 'DELETE':
      getAllData();
      if (typeof groupId === 'string') {
        const recipesGroup = recipesGroups.find((el) => el.id === +groupId);
        if (recipesGroup) {
          if (typeof id === 'string') {
            const recipe = recipesGroup.recipes.find((el) => el.id === +id);
            if (recipe) {
              const recipeId = recipesGroup.recipes.indexOf(recipe);
              recipesGroup.recipes.splice(recipeId, 1);
              res.status(202).send('Deleted');
              console.log('delete', recipe, 'from', recipesGroup);
            } else res.status(404).send('Not found');
          } else {
            const recipesGroupId = recipesGroups.indexOf(recipesGroup);
            recipesGroups.splice(recipesGroupId, 1);
            res.status(202).send('Deleted');
            console.log('delete recipe group', recipesGroup);
          }
        } else res.status(404).send('Not found');
      } else res.status(400).send('Bad request');
      updateData();
      break;
  }
};

export default handler;
