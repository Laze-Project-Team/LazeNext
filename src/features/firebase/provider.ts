import { GithubAuthProvider, GoogleAuthProvider, TwitterAuthProvider } from 'firebase/auth';

export const getProviderForProviderId = (
  providerId: string
): typeof GoogleAuthProvider | typeof TwitterAuthProvider | typeof GithubAuthProvider => {
  switch (providerId) {
    case GoogleAuthProvider.PROVIDER_ID:
      return GoogleAuthProvider;
    case TwitterAuthProvider.PROVIDER_ID:
      return TwitterAuthProvider;
    case GithubAuthProvider.PROVIDER_ID:
      return GithubAuthProvider;
    default:
      throw new Error(`Provider ${providerId} not supported`);
  }
};
