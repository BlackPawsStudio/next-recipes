import { FormEvent, useEffect, useState } from 'react';
import { RecipeType } from '../../pages/api/data';
import styles from './styles.module.css';

const RecipeForm = ({
  onSubmit,
  nameProps,
  ingredientsProps,
  recipeProps,
}: {
  onSubmit: (data: any) => void;
  nameProps?: string;
  ingredientsProps?: string[];
  recipeProps?: string;
}) => {
  const [name, setName] = useState(nameProps || '');
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [ingredients, setIngredients] = useState<string[]>(ingredientsProps || []);
  const [recipe, setRecipe] = useState(recipeProps || '');

  const addIngredient = () => {
    const newIngredients = ingredients.concat();
    if (currentIngredient) {
      newIngredients.push(currentIngredient);
      setCurrentIngredient('');
      setIngredients(newIngredients);
    } else {
      alert('Сперва введите ингредиент!');
    }
  };

  const removeIngredient = (id: number) => {
    const newIngredients = ingredients.concat();
    newIngredients.splice(id, 1);
    setIngredients(newIngredients);
  };

  const onSubmitLocal = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name && recipe) {
      const data: RecipeType = {
        id: 0,
        name: name,
        ingredients: ingredients,
        recipe: recipe,
      };
      console.log(data);
      onSubmit(data);
    } else {
      alert('Заполните поля!');
    }
  };

  return (
    <form onSubmit={onSubmitLocal} className={styles['container']}>
      <div>
        <label>Введите название</label>
        <input onChange={(e) => setName(e.target.value)} defaultValue={name || ''} />
      </div>
      <div>
        <label>Введите ингредиент</label>
        <input onChange={(e) => setCurrentIngredient(e.target.value)} value={currentIngredient} />
        <button type="button" onClick={addIngredient}>
          Добавить
        </button>
        <div>
          {ingredients.map((el, id) => (
            <span key={id}>
              <label>{el}</label>
              <span onClick={() => removeIngredient(id)}>X</span>
            </span>
          ))}
        </div>
      </div>
      <div>
        <label>Введите сам рецепт</label>
        <textarea onChange={(e) => setRecipe(e.target.value)} defaultValue={recipe || ''} />
      </div>
      <button type="submit">Сохранить</button>
    </form>
  );
};

export default RecipeForm;
