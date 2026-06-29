import { useState, type FormEvent } from 'react';
import { useExams } from '../../../shared/hooks/useExams';
import ExamItem from './ExamItem';
import Card from '../../../shared/ui/Card';
import Input from '../../../shared/ui/Input';
import Button from '../../../shared/ui/Button';

const ExamList = () => {
  const { exams, loading, error, addExam, removeExam } = useExams();
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [timeFrom, setTimeFrom] = useState('');
  const [timeTo, setTimeTo] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !date) return;

    await addExam({ name, date, timeFrom, timeTo });
    setName('');
    setDate('');
    setTimeFrom('');
    setTimeTo('');
  };

  return (
    <div className="flex flex-col gap-6">
      <Card title="ახალი გამოცდის დამატება">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input label="დასახელება" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="თარიღი" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

          <div className="flex gap-3">
            <Input label="დან" type="time" value={timeFrom} onChange={(e) => setTimeFrom(e.target.value)} />
            <Input label="მდე" type="time" value={timeTo} onChange={(e) => setTimeTo(e.target.value)} />
          </div>

          <Button type="submit">დამატება</Button>
        </form>
      </Card>

      <Card title="გამოცდები">
        {loading && <p>იტვირთება...</p>}
        {error && <p className="text-red-500">შეცდომა: {error}</p>}
        {!loading && exams.length === 0 && <p>გამოცდები არ მოიძებნა</p>}

        <ul className="flex flex-col gap-2">
          {exams.map((exam) => (
            <ExamItem key={exam.id} exam={exam} removeExam={removeExam} />
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default ExamList