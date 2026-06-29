import { useState, type FormEvent } from 'react';
import { useDocuments } from '../../../shared/hooks/useDocuments';
import Card from '../../../shared/ui/Card';
import Input from '../../../shared/ui/Input';
import Button from '../../../shared/ui/Button';
import DocumentItem from './DocumentItem';

const DocumentList = () => {
  const { documents, loading, error, addDocument, removeDocument } = useDocuments();
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name) return;

    await addDocument({ name, type, description });
    setName('');
    setType('');
    setDescription('');
  };

  return (
    <div className="flex flex-col gap-6">
      <Card title="ახალი დოკუმენტის დამატება">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input label="დასახელება" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="ტიპი" value={type} onChange={(e) => setType(e.target.value)} />
          <Input label="აღწერა" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Button type="submit">დამატება</Button>
        </form>
      </Card>

      <Card title="დოკუმენტები">
        {loading && <p>იტვირთება...</p>}
        {error && <p className="text-red-500">შეცდომა: {error}</p>}
        {!loading && documents.length === 0 && <p>დოკუმენტები არ მოიძებნა</p>}

        <ul className="flex flex-col gap-2">
          {documents.map((doc) => (
            <DocumentItem key={doc.id} doc={doc} removeDocument={removeDocument} />
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default DocumentList