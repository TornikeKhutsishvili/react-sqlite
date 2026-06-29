import { usePupils } from '../../../shared/hooks/usePupils';
import { PupilItem } from './PupilItem';

const PupilList = () => {
  const { pupils, loading, error, addPupil } = usePupils();

  if (loading) return <div>იტვირთება...</div>;
  if (error) return <div>შეცდომა: {error}</div>;

  const handleAddDemo = () => addPupil({ firstname: 'თორნიკე', lastname: 'ხუციშვილი' });

  return (
    <div>
      <h2>ჩემი მოსწავლეები</h2>
      <button type="button" onClick={handleAddDemo}>დემო მოსწავლის დამატება</button>
      <ul>
        {pupils.map(({id, firstname, lastname}) => (
          <PupilItem key={id} firstname={firstname} lastname={lastname} />
        ))}
      </ul>
    </div>
  );
}

export default PupilList