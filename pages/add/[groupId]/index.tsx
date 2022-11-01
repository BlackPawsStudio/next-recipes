import { useRouter } from 'next/router';
import RecipeForm from '../../../components/RecipeForm';
import { RecipeType } from '../../api/data';

const AddPage = () => {
  const router = useRouter();
  const onSubmit = async (data: RecipeType) => {
    const response = await fetch(`/api?groupId=${router.query.groupId}&id=save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (response.status === 201) {
      router.push('/');
    } else {
      alert(`${response.status} ${response.statusText}`);
    }
  };
  return <RecipeForm onSubmit={onSubmit} />;
};

export default AddPage;
