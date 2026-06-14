export const TECH_STACKS = [
  { id: 'JAVASCRIPT', label: 'JavaScript' },
  { id: 'TYPESCRIPT', label: 'TypeScript' },
  { id: 'PYTHON', label: 'Python' },
  { id: 'JAVA', label: 'Java' },
  { id: 'KOTLIN', label: 'Kotlin' },
  { id: 'SWIFT', label: 'Swift' },
  { id: 'REACT', label: 'React' },
  { id: 'NEXTJS', label: 'Next.js' },
  { id: 'VUE', label: 'Vue' },
  { id: 'REACT_NATIVE', label: 'React Native' },
  { id: 'NODEJS', label: 'Node.js' },
  { id: 'NESTJS', label: 'NestJS' },
  { id: 'SPRING', label: 'Spring' },
  { id: 'DJANGO', label: 'Django' },
  { id: 'FASTAPI', label: 'FastAPI' },
  { id: 'POSTGRESQL', label: 'PostgreSQL' },
  { id: 'MYSQL', label: 'MySQL' },
  { id: 'MONGODB', label: 'MongoDB' },
  { id: 'AWS', label: 'AWS' },
  { id: 'DOCKER', label: 'Docker' },
] as const;

export type TechStackId = (typeof TECH_STACKS)[number]['id'];
