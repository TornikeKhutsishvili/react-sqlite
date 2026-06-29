# Teacher Book API - Backend & React (TypeScript) Guide

Express.js + SQLite ბექენდი მასწავლებლების, მოსწავლეების, გამოცდებისა და დოკუმენტების მონაცემებისთვის.

---

## 🚀 ბექენდის გაშვება

### 1. დააინსტალირე Node.js

გადმოწერე და დააინსტალირე: [https://nodejs.org](https://nodejs.org) (LTS ვერსია)

### 2. დააინსტალირე dependencies

გახსენი ტერმინალი ამ ფოლდერში და გაუშვი:

```bash
npm install
```

### 3. გაუშვი სერვერი

```bash
npm start
```

სერვერი გაეშვება **http://localhost:5000** პორტზე.

### 4. API დოკუმენტაცია (Swagger)

ბრაუზერში გახსენი: **http://localhost:5000/api-docs**

---

## 📐 React + TypeScript არქიტექტურა (სად რა იწერება)

Angular-ისგან განსხვავებით, სადაც ვიყენებთ `@Injectable()` სერვისებს და Dependency Injection-ს, React + TypeScript პროექტებში ვიყენებთ შემდეგ სტრუქტურას:

```TypeScript
src/
├── types/
│   └── index.ts              ← ყველა ტიპის და ინტერფეისის დეკლარაცია (User, Pupil, და ა.შ.)
├── services/
│   ├── api.ts                ← ბაზისური API კონფიგურაცია (Axios ინსტანცია ან Fetch helper)
│   ├── auth.service.ts       ← ავტორიზაციის HTTP მოთხოვნები
│   └── pupil.service.ts      ← მოსწავლეების HTTP მოთხოვნები
├── hooks/
│   ├── useAuth.ts            ← ავტორიზაციის Hook (State + რეაქტიული ლოგიკა)
│   └── usePupils.ts          ← მოსწავლეების Hook (State + რეაქტიული ლოგიკა)
├── components/
│   └── PupilList.tsx         ← UI კომპონენტი
└── App.tsx
```

---

## 💻 TypeScript ფაილების მაგალითები სტუდენტებისთვის

### 1. ტიპების განსაზღვრა (`src/types/index.ts`)

აქ აღვწერთ ბექენდიდან წამოსულ მონაცემთა სტრუქტურას.

```TypeScript
export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  subject?: string;
}

export interface Pupil {
  id: number;
  teacher_id: number;
  firstname: string;
  lastname: string;
  personal_number?: string;
  email?: string;
  phone?: string;
  alternate_number?: string;
  status?: string;
  activity_status?: string;
  module?: string;
  group_name?: string;
  credit?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
```

### 2. სერვისი (`src/services/pupil.service.ts`)

სუფთა ფუნქციები API-სთან საკომუნიკაციოდ (არ შეიცავს React State-ს).

```typescript
import { Pupil } from '../types';

const BASE_URL = 'http://localhost:5000/api';

// ჰედერების დამხმარე ფუნქცია ტოკენისთვის
const getHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export const pupilService = {
  // აბრუნებს მოსწავლეების მასივს
  getAll: async (): Promise<Pupil[]> => {
    const res = await fetch(`${BASE_URL}/pupils`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch pupils');
    return res.json();
  },

  // ამატებს ახალ მოსწავლეს
  create: async (pupilData: Partial<Pupil>): Promise<Pupil> => {
    const res = await fetch(`${BASE_URL}/pupils`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(pupilData),
    });
    if (!res.ok) throw new Error('Failed to create pupil');
    return res.json();
  },
};
```

### 3. Custom Hook (`src/hooks/usePupils.ts`)

აკავშირებს სერვისს React-ის State-თან (წარმოადგენს Angular-ის სერვისის რეაქტიულ ნაწილს).

```typescript
import { useState, useEffect } from 'react';
import { Pupil } from '../types';
import { pupilService } from '../services/pupil.service';

export const usePupils = () => {
  const [pupils, setPupils] = useState<Pupil[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPupils = async () => {
    try {
      setLoading(true);
      const data = await pupilService.getAll();
      setPupils(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const addPupil = async (pupilData: Partial<Pupil>) => {
    try {
      const newPupil = await pupilService.create(pupilData);
      setPupils((prev) => [...prev, newPupil]);
    } catch (err: any) {
      setError(err.message || 'Failed to add pupil');
    }
  };

  useEffect(() => {
    fetchPupils();
  }, []);

  return { pupils, loading, error, addPupil, refetch: fetchPupils };
};
```

### 4. კომპონენტი (`src/components/PupilList.tsx`)

React კომპონენტი, რომელიც მარტივად იყენებს Custom Hook-ს.

```typescript
import React from 'react';
import { usePupils } from '../hooks/usePupils';

export const PupilList: React.FC = () => {
  const { pupils, loading, error, addPupil } = usePupils();

  if (loading) return <div>იტვირთება...</div>;
  if (error) return <div>შეცდომა: {error}</div>;

  const handleAddDemo = () => {
    addPupil({ firstname: 'გიორგი', lastname: 'ბერიძე' });
  };

  return (
    <div>
      <h2>ჩემი მოსწავლეები</h2>
      <button onClick={handleAddDemo}>დემო მოსწავლის დამატება</button>
      <ul>
        {pupils.map((pupil) => (
          <li key={pupil.id}>
            {pupil.firstname} {pupil.lastname}
          </li>
        ))}
      </ul>
    </div>
  );
};
```

---

## 🔐 ავტორიზაციის (Login) TypeScript მაგალითი

```typescript
// src/services/auth.service.ts
import { LoginResponse } from '../types';

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Invalid credentials');
    return res.json();
  }
};
```
