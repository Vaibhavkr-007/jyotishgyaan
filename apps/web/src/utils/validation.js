
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 8;
};

export const validatePasswordStrength = (password) => {
  let score = 0;
  if (!password) return { score: 0, text: 'Empty', color: 'bg-muted' };
  
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { score, text: 'Weak', color: 'bg-destructive' };
  if (score === 3 || score === 4) return { score, text: 'Medium', color: 'bg-auth-secondary' };
  return { score, text: 'Strong', color: 'bg-[hsl(var(--auth-success))]' };
};
