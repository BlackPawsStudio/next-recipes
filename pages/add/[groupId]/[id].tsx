import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import RecipeForm from '../../../components/RecipeForm';
import { RecipeType } from '../../api/data';

const EditPage = () => {
  const [data, setData] = useState<RecipeType | null>(null);
  const router = useRouter();
  const { groupId, id } = router.query;

  useEffect(() => {
    const getData = async () => {
      const response = await fetch(`/api?groupId=${groupId}&id=${id}`);
      if (response.status === 200) {
        const resData = await response.json();
        setData(resData);
      } else {
        alert(`${response.status} ${response.statusText}`);
      }
    };
    if (typeof groupId === 'string' && typeof id === 'string') {
      getData();
    }
  }, [groupId, id]);

  const onSubmit = async (data: RecipeType) => {
    const response = await fetch(`/api?groupId=${groupId}&id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status === 202) {
      router.push('/');
    } else {
      alert(`${response.status} ${response.statusText}`);
    }
  };
  return (
    <>
      {data && (
        <RecipeForm
          onSubmit={onSubmit}
          nameProps={data?.name}
          recipeProps={data?.recipe}
          ingredientsProps={data?.ingredients}
        />
      )}
    </>
  );
};

export default EditPage;
