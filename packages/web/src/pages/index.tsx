import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";

type HomeProps = {
  title: string;
};

export default function Home(props: HomeProps) {
  return (
    <main className="mx-auto mt-6 max-w-4xl rounded bg-white p-4 shadow">
      {props.title}
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      title: "Sample",
    },
  };
};
