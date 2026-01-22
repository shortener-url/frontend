import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function Recaptcha({ action, onVerify }: { action: string; onVerify: (token: string) => void }) {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleReCaptchaVerify = async (): Promise<string | null> => {
    if (!executeRecaptcha) {
      console.log('Recaptcha not available');
      return null; // Retornamos null si no está disponible
    }

    const token = await executeRecaptcha(action);
    onVerify(token);
    return token; // Retornamos el token
  };

  return { handleReCaptchaVerify };
}
