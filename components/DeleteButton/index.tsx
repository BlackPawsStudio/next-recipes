import { useState } from 'react';
import styles from './styles.module.css';

const DeleteButton = ({ url }: { url: string }) => {
  const [isOpened, setIsOpened] = useState(false);

  const deleteTarget = async () => {
    const response = await fetch(`/api?${url}`, {method: 'DELETE'});
    if (response.status === 202) {
      alert('Deleted');
      location.reload();
    } else {
      alert(response.statusText);
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
            Are you sure?
            <div className={styles['buttons']}>
              <button onClick={deleteTarget}>Yes</button>
              <button>No</button>
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
          Delete
        </button>
      )}
    </>
  );
};

export default DeleteButton;
