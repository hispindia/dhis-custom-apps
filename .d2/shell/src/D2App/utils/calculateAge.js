export function calculateAge(dob) {
  if (!dob) return '';
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  // Adjust age if birthdate hasn't occurred yet this year
  if (monthDiff < 0 || monthDiff === 0 && dayDiff < 0) {
    age--;
  }
  return age;
}