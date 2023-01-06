import { LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import { getToken } from "~/session";

interface LoaderProps {
  isLogined: boolean;
}

export const loader: LoaderFunction = async ({ request }) => {
  const token = await getToken(request.headers);
  return json<LoaderProps>({ isLogined: token != null });
};

const Index = () => {
  const { isLogined } = useLoaderData<LoaderProps>();
  return (
    <div>
      {isLogined && 'ログイン済み' || 'ログインしていません'}
      <Link to='/login'>Login</Link>
    </div>
  );
};

export default Index;
