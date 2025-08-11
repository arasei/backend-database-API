"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";//現在のURLパス（例: /admin/posts）を取得するためのフック。現在のページがどれかを判別して、ナビゲーションにハイライトを付けるために使う。


//全体の概要
//管理画面のレイアウトを構成するためのサイドバー付きのReactコンポーネント。
//現在のURLに応じて「記事一覧」または「カテゴリー一覧」メニューにハイライトを付け、
//指定された子コンポーネント（children）をメインエリアに表示する。


//管理画面のレイアウトコンポーネントを定義
//children はこのレイアウトの中に表示したいコンテンツ
const AdminSideBar = ({ children }: { children: React.ReactNode}) => {
  const pathname = usePathname();//現在のパス（例: /admin/categories）を取得してリンクのハイライトに使う。
  //children=「このレイアウト内に表示したいページの中身」
  return (
    <div className="flex min-h-screen">
      <aside className="w-60 bg-gray-100">
        <ul className="space-y-0">
          <li>
            {/*記事一覧ページへのリンク。現在のパスが /admin/posts の場合にだけ bg-blue-100 を付けてハイライトする*/}
            <Link href="/admin/posts"
            className={`block w-full py-4 px-4 ${pathname === "/admin/posts" ? "bg-blue-100" : ""}`}
            >
              記事一覧
            </Link>
          </li>
          <li>
            {/*「カテゴリー一覧」のメニューリンクを作成。現在のURLが /admin/categories の場合はハイライトする*/}
            <Link href="/admin/categories"
            className={`block w-full py-4 px-4 ${pathname === "/admin/categories" ? "bg-blue-100" : ""}`}
            >
            カテゴリー一覧
            </Link>{" "}
          </li>
        </ul>
      </aside>
      {/*メイン表示エリア*/}
      {/*children がこの <AdminSideBar> コンポーネント内に表示されます。*/}
      <main className="flex-1 bg-white p-8">{children}</main>
    </div>
  );
};

export default AdminSideBar;

