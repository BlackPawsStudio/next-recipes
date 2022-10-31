import { useRouter } from 'next/router';
import RecipeForm from '../../../components/RecipeForm';
import { RecipeType } from '../../api/data';

const EditPage = () => {
  const router = useRouter();
  const {groupId, id} = router.query;
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
      alert(response.statusText);
    }
  };
  return <RecipeForm onSubmit={onSubmit} />;
};

export default EditPage;
