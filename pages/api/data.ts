export interface RecipeType {
  id?: number;
  name: string;
  ingredients: string[];
  recipe: string;
}

export interface RecipesGroupType {
  id: number;
  name: string;
  recipes: RecipeType[];
}

const recipesGroups: RecipesGroupType[] = [
  {
    id: 0,
    name: 'test',
    recipes: [
      {
        id: 0,
        name: 'test rec',
        ingredients: ['молоко', 'vfckj'],
        recipe: 'я @ ты @ ',
      },
    ],
  },
];

// export const deleteRecipe = (groupId: string, id: string) => {
//   
// };

// export const deleteGroup = (groupId: string) => {
//   const recipesGroups = getRecipesGroups();
//   
// };

export default recipesGroups;
