import { Link } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { type ComponentProps } from 'react';
import { Platform } from 'react-native';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & {
  href: "/Auth" | "/components/ServicioProgreso" | string;  // Puedes añadir más rutas específicas aquí
};

export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href="/Auth"
      onPress={async (event) => {
        if (Platform.OS !== 'web') {
          event.preventDefault();
          await openBrowserAsync(href);
        }
      }}
    />
  );
}
