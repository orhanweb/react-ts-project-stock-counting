import Lottie from 'react-lottie';
import { Link, useLocation } from 'react-router-dom';
import animationData from '../../../public/animations/NotFoundPage_lottie.json';
import { useTranslation } from 'react-i18next';

const NotFoundPage : React.FC = () => {
  const { t, i18n } = useTranslation();
  const message = useLocation().state?.message || 'Aradığınız sayfa bulunamadı';

  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid meet'
    }
  };

  return (
    <div id='not-found-page-container' className='flex flex-col items-center justify-center gap-4 absolute top-1/2 transform -translate-y-1/2 my-auto'>
      <h1>{i18n.language}</h1>
      <h1>{t('greetings')}</h1>
      <div className='w-full lg:w-1/2' style={{ pointerEvents: 'none' }}>
        <Lottie options={defaultOptions} speed={2}/>
      </div>
      <p className='text-center font-light text-xl md:text-2xl  lg:text-3xl tracking-wider opacity-50'>{message}</p>
      <Link to="/" className='border-2 px-4 py-2 rounded-full hover:bg-primary hover:border-primary transition-colors duration-300 ease-in-out text-text-darkest dark:text-text-lightest w-fit'>Ana Sayfaya Dön</Link>
    </div>
  );
};

export default NotFoundPage;
