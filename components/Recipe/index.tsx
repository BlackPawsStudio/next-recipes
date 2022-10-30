import Link from 'next/link';
import { RecipeType } from '../../pages/api/data';
import DeleteButton from '../DeleteButton';

const Recipe = ({ data, groupId }: { data: RecipeType; groupId: number }) => (
  <>
    <li>
      <Link href={`/${groupId}/${data.id}`}>{data.name}</Link>
      <DeleteButton url={`groupId=${groupId}&id=${data.id}`} />
    </li>
  </>
);

export default Recipe;
