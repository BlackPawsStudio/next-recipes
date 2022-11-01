import Link from 'next/link';
import { useState } from 'react';
import { RecipesGroupType } from '../../pages/api/data';
import DeleteButton from '../DeleteButton';
import Recipe from '../Recipe';
import styles from './styles.module.css';

const RecipesGroup = ({ data, add }: { data?: RecipesGroupType; add?: boolean }) => {
  const [isOpened, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');

  const addGroup = async () => {
    const response = await fetch('/api?groupId=save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newName,
        recipes: [],
      }),
    });
    if ((await response.status) === 201) {
      location.reload();
    } else {
      alert(`${response.status} ${response.statusText}`);
    }
  };
  return (
    <div className={styles['container']}>
      {add ? (
        <h3 onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? (
            <>
              <input
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  e.stopPropagation();
                  setNewName(e.target.value);
                }}
              />
              <button onClick={addGroup}>Сохранить</button>
            </>
          ) : (
            'Добавить'
          )}
        </h3>
      ) : (
        <>
          <h3 onClick={() => setIsOpen(!isOpened)}>
            <span>{isOpened ? '-' : '+'}</span>
            {data?.name}
            <DeleteButton url={`groupId=${data?.id}`} />
          </h3>
          <ul className={isOpened ? styles['opened'] : ''}>
            <li>
              <Link href={`add/${data?.id}`}>Добавить</Link>
            </li>
            {data?.recipes &&
              data.recipes.map((el, id) => <Recipe key={id} data={el} groupId={data?.id || 0} />)}
          </ul>
        </>
      )}
    </div>
  );
};

export default RecipesGroup;
