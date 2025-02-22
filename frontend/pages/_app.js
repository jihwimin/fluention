import '../styles/global.css';
import { Livvic } from 'next/font/google';

const livvic = Livvic({
  subsets: ['latin'],
  weight: ['300', '400', '700'], // Choose the weights you need
});

export default function MyApp({ Component, pageProps }) {
  return (
    <div className={livvic.className}>
      <Component {...pageProps} />
    </div>
  );
}
