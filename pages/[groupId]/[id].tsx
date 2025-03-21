import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { RecipeType } from '../api/data';
import styles from './styles.module.css';
import ReactMarkdown from 'react-markdown';

const RecipePage = () => {
  const router = useRouter();
  const { groupId, id } = router.query;

  const [data, setData] = useState<RecipeType | null>();
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
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
  }, [router, groupId, id]);
  return (
    <div className={styles['container']}>
      {data ? (
        <>
          <h3>
            <label>{data?.name}</label>
            <button onClick={() => router.push(`/add/${groupId}/${id}`)}>Изменить</button>
          </h3>
          <div>
            {data?.ingredients.map((el, id) => (
              <div key={id}>{el}</div>
            ))}
          </div>
          <div className={styles["recipe"]}>
            <ReactMarkdown>{data?.recipe}</ReactMarkdown>
          </div>
        </>
      ) : (
        <h3>{message}</h3>
      )}
    </div>
  );
};

export default RecipePage;
