# Laze

Lazeは環境構築不要かつ母国語でできるプログラミング言語です
[今すぐLazeでプログラミングを始める](http://laze.ddns.net)

## 目次

- [Lazeの特徴](#Lazeの特徴)
- [Lazeに参加する](#Lazeに参加する)
- [開発に寄与する](#開発に寄与する)
- [開発者向け情報](#開発者向け情報)

## Lazeの特徴

Lazeは大きく分けて2つの特徴があります。

### 母国語プログラミング

Lazeは母国語でプログラミングできるように設計されていて、英語以外の言語でプログラミングできるほか、異なる言語間の変換も行うことができます。

### 環境構築不要

Lazeはブラウザ上で実行できる言語のため、環境構築を全くすることなくプログラミングを始めることができます。

* [公式ウェブサイト](http://laze.ddns.net)
* [オンラインエディタ](https://laze.ddns.net/editor)
* [オンラインドキュメンテーション](https://laze.ddns.net/docs)

## Lazeに参加する

### コミュニティに参加する

Lazeの[公式Discordサーバー](https://discord.gg/K3prMrmS7e)に参加してみましょう！Lazeについて詳しくなれるかもしれません。

## 開発に寄与する

Lazeの開発をお手伝いしたいですか？

報告・要望・提案などはIssueや[Twitter](https://twitter.com/LazeProjectTeam)、[公式Discordサーバー](https://discord.gg/K3prMrmS7e)で受け付けています。PR(プルリクエスト)も大歓迎です。

### バグ報告

バグが起きる状況をご自身の環境と合わせて**できるだけ詳しく**書いて下さい。できるだけ早急に対処したいと思います。

### 要望

コンパイラでもウェブサイトでもエディタでも機能の追加・修正の要望があれば遠慮なく送ってください。送る際は「なぜ機能(修正)が必要なのか」も添えてもらえると嬉しいです。

### PR(Pull Request)

機能の追加・修正をPRとして送ってもらうのも大歓迎です。

## 開発者向け情報

### 使用している技術(ライブラリ)

- ウェブサイト
  - Next.js(メインフレームワーク)
  - Ant Design(UIフレームワーク)
  - next-i18next(多言語対応)
  - monaco-editor(エディタ)
- 開発
  - TypeScript(メイン言語)
  - Prettier(フォーマッタ)
  - ESLint(コードのチェック)
  - Tailwind CSS(スタイル)

### 開発者クイックスタート

前提として[Node.js](https://nodejs.org/ja/)、[Git](https://git-scm.com/)

このリポジトリをcloneする

```bash
git clone ~~~
cd ~~~
```

Yarnのインストール(Yarnを既に入れている場合は省略可)

```bash
npm i --global yarn
```

必要なパッケージをインストールする

```bash
yarn
```

コンパイラを入手してその絶対パスを`.env`(`.env.template`をコピーして作成する)内の`COMPILER_PATH`に書く。

**各コマンドの解説**
`yarn dev`で開発サーバーを建てます
`yarn build`でビルドを行います
`yarn start`でサーバーを実行します(要ビルド)
