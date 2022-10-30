import { useEffect, useState } from 'react';
import RecipesGroup from '../components/RecipesGroup';
import { RecipesGroupType } from './api/data';

export default function Home() {
  const [recipes, setRecipes] = useState<RecipesGroupType[]>([]);

  useEffect(() => {
    const getData = async () => {
      const response = await fetch('/api');
      setRecipes(await response.json());
    };
    getData();
  }, []);

  return (
    <>
      {recipes ? recipes.map((el, id) => (
        <RecipesGroup key={id} data={el} />
      )) : 'Loading...' }
      <RecipesGroup add />
    </>
  );
}
