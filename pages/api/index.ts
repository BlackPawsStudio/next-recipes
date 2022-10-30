import recipesGroups, { RecipesGroupType } from './data';
import { RecipeType } from './data';
import { NextApiRequest, NextApiResponse } from 'next';

const getLowestId = (id: number, arr: any[]): number =>
  arr.find((el) => el.id === id) ? getLowestId(++id, arr) : id;
  
const handler = (
  req: NextApiRequest,
  res: NextApiResponse<RecipeType | RecipesGroupType[] | string>
) => {
  const { groupId, id } = req.query;
  switch (req.method) {
    case 'POST':
      if (groupId) {
        const data = req.body;
        const lowestID = getLowestId(0, recipesGroups);
        data.id = lowestID;
        if (id) {
          const recipesGroup = recipesGroups.find((el) => el.id === +groupId);
          if (recipesGroup) {
            recipesGroup.recipes.push(data);
          } else {
            res.status(404).send('Not found');
          }
        } else {
          recipesGroups.push(data);
        }
        console.log('entry added', recipesGroups);
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
          } else {
            res.status(404).send('Not found');
          }
        } else {
          res.status(404).send('Not found');
        }
      } else {
        res.status(200).send(recipesGroups);
        console.log('get all recipes');
      }
      break;
    case 'PUT':
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
      break;
  }
};

export default handler;
