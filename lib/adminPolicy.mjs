// UI checks are convenience only; Firestore rules enforce writes independently.
export const ADMIN_EMAIL = 'johyun3662@gmail.com';
export function isVerifiedAdmin(user) {
  return Boolean(user && user.email === ADMIN_EMAIL && user.emailVerified === true);
}
