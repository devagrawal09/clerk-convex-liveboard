import { SignedIn, SignedOut } from "@clerk/nextjs";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Head from "next/head";
import { LiveBoard } from "./live-board";

const SignupLink = () => (
  <Link href="/sign-up" className={styles.cardContent}>
    <img src="/icons/user-plus.svg" />
    <div>
      <h3>Sign up for an account</h3>
      <p>
        Sign up and sign in to explore all the features provided by Clerk
        out-of-the-box
      </p>
    </div>
    <div className={styles.arrow}>
      <img src="/icons/arrow-right.svg" />
    </div>
  </Link>
);

// Main component using <SignedIn> & <SignedOut>.
//
// The SignedIn and SignedOut components are used to control rendering depending
// on whether or not a visitor is signed in.
//
// https://docs.clerk.dev/frontend/react/signedin-and-signedout
const Main = () => (
  <main className={styles.main}>
    <h1 className={styles.title}>Welcome to LiveBoard</h1>

    <div className={styles.cards}>
      <div className={styles.card}>
        <SignedIn>
          <LiveBoard />
        </SignedIn>
        <SignedOut>
          <SignupLink />
        </SignedOut>
      </div>
    </div>

    <div className={styles.links}>
      <Link
        href="https://docs.clerk.dev"
        target="_blank"
        rel="noreferrer"
        className={styles.link}
      >
        <span className={styles.linkText}>Clerk docs</span>
      </Link>
      <Link
        href="https://docs.convex.dev/"
        target="_blank"
        rel="noreferrer"
        className={styles.link}
      >
        <span className={styles.linkText}>Convex docs</span>
      </Link>
      <Link
        href="https://nextjs.org/docs"
        target="_blank"
        rel="noreferrer"
        className={styles.link}
      >
        <span className={styles.linkText}>NextJS docs</span>
      </Link>
    </div>
  </main>
);

// Footer component
const Footer = () => (
  <footer className={styles.footer}>
    Powered by{" "}
    <a href="https://clerk.dev" target="_blank" rel="noopener noreferrer">
      <img src="/clerk.svg" alt="Clerk.dev" className={styles.logo} />
    </a>
    +
    <a href="https://convex.dev" target="_blank" rel="noopener noreferrer">
      <img src="/convex.jpeg" alt="Convex.dev" className={styles.logo} />
    </a>
    +
    <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer">
      <img src="/nextjs.svg" alt="Next.js" className={styles.logo} />
    </a>
  </footer>
);

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>
      <Main />
      <Footer />
    </div>
  );
}
