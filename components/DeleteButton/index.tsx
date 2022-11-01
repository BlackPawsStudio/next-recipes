import { useState } from 'react';
import styles from './styles.module.css';

const DeleteButton = ({ url }: { url: string }) => {
  const [isOpened, setIsOpened] = useState(false);

  const deleteTarget = async () => {
    const response = await fetch(`/api?${url}`, { method: 'DELETE' });
    if (response.status === 202) {
      alert('Удалено');
      location.reload();
    } else {
      alert(`${response.status} ${response.statusText}`);
    }
  };

  return (
    <>
      {isOpened ? (
        <div
          className={styles['container']}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpened(false);
          }}
        >
          <div className={styles['question']}>
            Вы уверены?
            <div className={styles['buttons']}>
              <button onClick={deleteTarget}>Да</button>
              <button>Нет</button>
            </div>
          </div>
        </div>
      ) : (
        <button
          className={styles['button']}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpened(true);
          }}
        >
          Удалить
        </button>
      )}
    </>
  );
};

export default DeleteButton;
