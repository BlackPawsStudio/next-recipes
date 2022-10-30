import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { RecipeType } from '../api/data';
import styles from './styles.module.css';

const RecipePage = () => {
  const router = useRouter();

  const [data, setData] = useState<RecipeType | null>();
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    const { groupId, id } = router.query;
    const getData = async () => {
      const response = await fetch(`/api?groupId=${groupId}&id=${id}`);
      if (response.status === 200) {
        setData(await response.json());
      } else {
        setMessage('404 Not found');
      }
    };
    if (typeof groupId === 'string' && typeof id === 'string') {
      getData();
    }
  }, [router]);
  return (
    <div className={styles['container']}>
      {data ? (
        <>
          <h3>
            <label>{data?.name}</label>
            <button>Change</button>
          </h3>
          <div>
            {data?.ingredients.map((el, id) => (
              <div key={id}>{el}</div>
            ))}
          </div>
          <p>{data?.recipe}</p>
        </>
      ) : (
        <h3>{message}</h3>
      )}
    </div>
  );
};

export default RecipePage;
