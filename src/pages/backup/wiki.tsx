// wiki.tsx
import { GetServerSideProps } from 'next';
import React from 'react';

interface WikiData {
  title: string;
  extract: string;
}

interface WikiPageProps {
  data: WikiData;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const topic = "Albert_Einstein";
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${topic}`;
  const res = await fetch(url);
  const data: WikiData = await res.json();

  return { props: { data } };
};

const WikiPage: React.FC<WikiPageProps> = ({ data }) => {
  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.extract}</p>
    </div>
  );
};

export default WikiPage;
