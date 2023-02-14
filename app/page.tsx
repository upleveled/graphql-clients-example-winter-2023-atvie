import { gql } from '@apollo/client';
import Image from 'next/image';
import { initializeApollo } from '../util/client';

type GitHubProfileResponse = {
  user: {
    name: string;
    avatarUrl: string;
    repositories: {
      edges: {
        node: {
          name: string;
          id: string;
        };
      }[];
    };
  };
};

export default async function HomePage() {
  const client = initializeApollo(null);

  const { data } = await client.query<GitHubProfileResponse>({
    query: gql`
      query profileQuery($username: String = "prochaLu") {
        user(login: $username) {
          name
          avatarUrl
          repositories(last: 10) {
            edges {
              node {
                name
                defaultBranchRef {
                  name
                  id
                }
              }
            }
          }
        }
      }
    `,
  });

  return (
    <main>
      <h1>{data.user.name}'s Profile</h1>
      <Image
        src={data.user.avatarUrl}
        alt={`${data.user.name}'s avatar`}
        width="400"
        height="400"
      />
      <h2>Repositories</h2>
      {data.user.repositories.edges.map((repository) => (
        <li key={repository.node.id}>{repository.node.name}</li>
      ))}
    </main>
  );
}
