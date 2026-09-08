import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB, disconnectDB } from '../config/db.js';
import Message from '../models/Message.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

// Seeded PRNG (Mulberry32) for reproducible, deterministic dataset
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(20260910);

function randomChoice(arr) {
  return arr[Math.floor(rng() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const PARTICIPANTS = [
  'Kunal',
  'Priya',
  'Rahul',
  'Aman',
  'Neha',
  'Arjun',
  'Simran',
  'Riya',
];

// 3 Critical Decision Threads (canonical timestamps & externalIds for benchmarks)
export const DECISION_THREADS = [
  {
    threadId: 'winter_trip',
    startDate: new Date('2026-01-14T17:30:00.000Z'),
    messages: [
      { sender: 'Priya', message: 'Guys winter break ka kya plan hai? Kahin ghoomne chalein?', externalId: 'trip-001', messageType: 'decision', offsetMinutes: 0 },
      { sender: 'Rahul', message: 'Somewhere with snow? Thand me snow dekhne ka man hai', externalId: 'trip-002', messageType: 'decision', offsetMinutes: 3 },
      { sender: 'Kunal', message: 'Shimla ya Auli bhi option hai vaise', externalId: 'trip-003', messageType: 'decision', offsetMinutes: 7 },
      { sender: 'Neha', message: 'Shimla me bheed bohot hogi yaar, Manali better lag raha hai', externalId: 'trip-004', messageType: 'decision', offsetMinutes: 12 },
      { sender: 'Aman', message: 'Manali kar lete hain, snow bhi milegi 😂', externalId: 'trip-005', messageType: 'decision', offsetMinutes: 16 },
      { sender: 'Simran', message: 'Old Manali me cafes bhi mast hain, vibes are great', externalId: 'trip-006', messageType: 'decision', offsetMinutes: 20 },
      { sender: 'Arjun', message: 'Done fir, destination Manali final karte hain!', externalId: 'trip-007', messageType: 'decision', offsetMinutes: 24 },
      { sender: 'Priya', message: 'Hotel budget kitna rakhein per person?', externalId: 'trip-008', messageType: 'decision', offsetMinutes: 28 },
      { sender: 'Rahul', message: '2500 per person max? Usse zyada student budget me nahi baithega', externalId: 'trip-009', messageType: 'decision', offsetMinutes: 32 },
      { sender: 'Neha', message: 'Cottage stay book karte hain with mountain view', externalId: 'trip-010', messageType: 'decision', offsetMinutes: 36 },
      { sender: 'Kunal', message: 'Cab karein ya bus se chalein?', externalId: 'trip-011', messageType: 'decision', offsetMinutes: 40 },
      { sender: 'Aman', message: 'Tempo traveller sahi rahega sab saath me rahenge', externalId: 'trip-012', messageType: 'decision', offsetMinutes: 44 },
      { sender: 'Riya', message: 'Haan tempo traveller is way more fun for 8 people', externalId: 'trip-013', messageType: 'decision', offsetMinutes: 48 },
      { sender: 'Arjun', message: 'Done, Manali dates 15 to 20 January lock ho gayi', externalId: 'trip-014', messageType: 'decision', offsetMinutes: 52 },
    ],
  },
  {
    threadId: 'college_event',
    startDate: new Date('2026-03-10T11:00:00.000Z'),
    messages: [
      { sender: 'Kunal', message: 'Annual tech fest HackCon 2026 ki planning start karni padegi', externalId: 'event-001', messageType: 'decision', offsetMinutes: 0 },
      { sender: 'Priya', message: 'Dean sir bol rahe the date lock karo pehle committee approval ke liye', externalId: 'event-002', messageType: 'decision', offsetMinutes: 4 },
      { sender: 'Rahul', message: 'Mid sems ke baad March 28-29 weekend kaisa hai?', externalId: 'event-003', messageType: 'decision', offsetMinutes: 8 },
      { sender: 'Neha', message: 'March 28-29 is perfect, exam stress bhi khatam ho jayega', externalId: 'event-004', messageType: 'decision', offsetMinutes: 12 },
      { sender: 'Arjun', message: 'Dean approval letter submit kar diya hai maine', externalId: 'event-005', messageType: 'decision', offsetMinutes: 16 },
      { sender: 'Simran', message: 'Venue main auditorium book karein ya open ground?', externalId: 'event-006', messageType: 'decision', offsetMinutes: 20 },
      { sender: 'Arjun', message: 'Main Auditorium aur CS labs book kar lete hain presentations ke liye', externalId: 'event-007', messageType: 'decision', offsetMinutes: 24 },
      { sender: 'Riya', message: 'Total budget kitna approve hua hai council se?', externalId: 'event-008', messageType: 'decision', offsetMinutes: 28 },
      { sender: 'Kunal', message: 'College council approved ₹50,000 for event prizes and refreshments', externalId: 'event-009', messageType: 'decision', offsetMinutes: 32 },
      { sender: 'Aman', message: 'Sponsorship decks companies ko bhejna shuru karte hain', externalId: 'event-010', messageType: 'decision', offsetMinutes: 36 },
      { sender: 'Priya', message: 'Mai sponsorships aur guest judges handle karungi', externalId: 'event-011', messageType: 'decision', offsetMinutes: 40 },
      { sender: 'Rahul', message: 'Me and Neha will develop the event portal and registration website', externalId: 'event-012', messageType: 'decision', offsetMinutes: 44 },
      { sender: 'Simran', message: 'Social media posters and banner designs mai sambhal lungi', externalId: 'event-013', messageType: 'decision', offsetMinutes: 48 },
      { sender: 'Kunal', message: 'Responsibilities divide kar lete hain: me on logistics and permissions', externalId: 'event-014', messageType: 'decision', offsetMinutes: 53 },
    ],
  },
  {
    threadId: 'project_stack',
    startDate: new Date('2026-04-18T15:00:00.000Z'),
    messages: [
      { sender: 'Kunal', message: 'Final year capstone project ka architecture finalize karna hai', externalId: 'project-001', messageType: 'decision', offsetMinutes: 0 },
      { sender: 'Simran', message: 'Web app framework me React use karein ya Next.js?', externalId: 'project-002', messageType: 'decision', offsetMinutes: 3 },
      { sender: 'Priya', message: 'React with Vite will be super fast and lightweight for development', externalId: 'project-003', messageType: 'decision', offsetMinutes: 7 },
      { sender: 'Rahul', message: 'Backend REST API kis technology me banana hai?', externalId: 'project-004', messageType: 'decision', offsetMinutes: 11 },
      { sender: 'Aman', message: 'Node.js with Express is ideal, fast development cycle rahega', externalId: 'project-005', messageType: 'decision', offsetMinutes: 15 },
      { sender: 'Simran', message: 'Database me PostgreSQL ya MongoDB?', externalId: 'project-006', messageType: 'decision', offsetMinutes: 19 },
      { sender: 'Riya', message: 'Unstructured chat messages aur flexible documents ke liye MongoDB best fit hai', externalId: 'project-007', messageType: 'decision', offsetMinutes: 23 },
      { sender: 'Priya', message: 'Search ke liye paid OpenAI use karein ya local embeddings?', externalId: 'project-008', messageType: 'decision', offsetMinutes: 27 },
      { sender: 'Kunal', message: 'No paid APIs! We must use 100% free local embeddings on CPU', externalId: 'project-009', messageType: 'decision', offsetMinutes: 31 },
      { sender: 'Arjun', message: 'Styling me Tailwind CSS will give full control over aesthetics', externalId: 'project-010', messageType: 'decision', offsetMinutes: 35 },
      { sender: 'Neha', message: 'Perfect! React frontend, Node backend, MongoDB, and local embeddings. The stack is locked', externalId: 'project-011', messageType: 'decision', offsetMinutes: 39 },
      { sender: 'Aman', message: 'Architecture diagram ready karke repo readme me add kar diya', externalId: 'project-012', messageType: 'decision', offsetMinutes: 43 },
      { sender: 'Arjun', message: 'April me architecture document aur API schema team review ke liye share kar dunga', externalId: 'project-013', messageType: 'decision', offsetMinutes: 47 },
      { sender: 'Riya', message: 'Awesome, dev sprint starts Monday morning', externalId: 'project-014', messageType: 'decision', offsetMinutes: 52 },
    ],
  },
];

// Required benchmark conversation moments (with exact evaluation targets)
export const REQUIRED_BENCHMARK_CONVERSATIONS = [
  {
    targetDate: new Date('2026-02-08T16:20:00.000Z'),
    topic: 'interview_prep',
    messages: [
      { sender: 'Simran', text: 'mock interview schedule karein weekend pe?' },
      { sender: 'Kunal', text: 'haan Sunday 11 AM rakh lo, DSA aur system design practice ho jayegi' },
      { sender: 'Priya', text: 'mai resume questions aur behavioral round conduct karungi' },
      { sender: 'Aman', text: 'perfect, Google Meet link create kar dena' },
    ],
  },
  {
    targetDate: new Date('2026-03-04T10:15:00.000Z'),
    topic: 'fest_hackathon',
    messages: [
      { sender: 'Arjun', text: 'Forwarded: IEEE student branch hackathon registration link' },
      { sender: 'Rahul', text: 'check kar raha hoon, tracks kaafi interesting hain' },
      { sender: 'Neha', text: 'AI and Web3 track me submit karenge project' },
      { sender: 'Riya', text: 'team name kya rakhein registration me?' },
      { sender: 'Arjun', text: 'Binary Beasts ya CodeCrafters rakh lete hain 😂' },
    ],
  },
  {
    targetDate: new Date('2026-04-12T14:40:00.000Z'),
    topic: 'internship_call',
    messages: [
      { sender: 'Kunal', text: 'interview call aaya fintech startup se!' },
      { sender: 'Priya', text: 'congrats bhai!! Kab hai technical round?' },
      { sender: 'Kunal', text: 'Thursday 3 PM, live coding test hoga' },
      { sender: 'Rahul', text: 'all the best bro, DSA revise kar lena ache se' },
      { sender: 'Neha', text: 'party pending rahi select hone ke baad!' },
    ],
  },
  {
    targetDate: new Date('2026-03-02T13:10:00.000Z'),
    topic: 'exam_datesheet',
    messages: [
      { sender: 'Rahul', text: 'mid sem date sheet aa gayi kya?' },
      { sender: 'Simran', text: 'haan notice board aur Telegram group pe circulate ho rahi hai' },
      { sender: 'Kunal', text: 'first exam kiska hai date sheet me?' },
      { sender: 'Aman', text: 'OS pehla hai 16th ko, continuous do paper hain 💀' },
      { sender: 'Rahul', text: 'padhna start karna padega ab seriously' },
    ],
  },
  {
    targetDate: new Date('2026-01-22T13:00:00.000Z'),
    topic: 'canteen_hangout',
    messages: [
      { sender: 'Kunal', text: 'canteen chalein maggi aur chai peene?' },
      { sender: 'Aman', text: 'haan bhai 2 min me CS lab se nikal raha hoon' },
      { sender: 'Simran', text: 'cheese maggi order karna mere liye bhi' },
      { sender: 'Rahul', text: 'chalo table reserve karke baitho main aa raha' },
    ],
  },
  {
    targetDate: new Date('2026-02-19T20:30:00.000Z'),
    topic: 'dinner_dhaba',
    messages: [
      { sender: 'Neha', text: 'dhaba chalte hain shaam ko dinner ke liye' },
      { sender: 'Arjun', text: 'GT road wale Punjabi Dhaba pe chalte hain, butter chicken mast hai' },
      { sender: 'Riya', text: 'dal makhani aur garlic naan bhi order karenge' },
      { sender: 'Aman', text: 'bike leke niklo sab, 15 mins me reach out karte hain' },
      { sender: 'Neha', text: 'done, helmet pehan ke aana sab' },
    ],
  },
  {
    targetDate: new Date('2026-02-25T11:45:00.000Z'),
    topic: 'assignment_query',
    messages: [
      { sender: 'Aman', text: 'assignment submit hua kya sabka?' },
      { sender: 'Priya', text: 'haan maine subah hi upload kar diya portal pe' },
      { sender: 'Rahul', text: 'mera question 4 pending hai, formula kya use kiya?' },
      { sender: 'Simran', text: 'sliding window approach use karo 4th question me' },
      { sender: 'Aman', text: 'sorted, thanks Simran' },
    ],
  },
  {
    targetDate: new Date('2026-03-18T08:30:00.000Z'),
    topic: 'lab_practical',
    messages: [
      { sender: 'Neha', text: 'kal 9 AM lab practical hai, ready rehna sab' },
      { sender: 'Kunal', text: 'lab coat aur practical manual leke aana padega na?' },
      { sender: 'Arjun', text: 'haan Sharma sir bina file ke entry nahi denge' },
      { sender: 'Riya', text: 'signatures already ho gaye hain mere sab checked hai' },
    ],
  },
  {
    targetDate: new Date('2026-01-28T12:15:00.000Z'),
    topic: 'attendance_check',
    messages: [
      { sender: 'Riya', text: 'attendance portal check karo guys, 75% criteria strictly follow hoga' },
      { sender: 'Rahul', text: 'mera 73% show ho raha hai, medical certificate dena padega' },
      { sender: 'Simran', text: 'mentor se baat kar lo wo attendance waive kar dete hain' },
      { sender: 'Kunal', text: 'Dean office me application submit karni padti hai with proof' },
      { sender: 'Riya', text: 'jaldi karo warn admit card rok lenge' },
    ],
  },
  {
    targetDate: new Date('2026-02-14T19:40:00.000Z'),
    topic: 'rolls_food',
    messages: [
      { sender: 'Aman', text: 'Rolls King se double egg roll order karein?' },
      { sender: 'Priya', text: 'haan paneer roll mere liye add kar dena' },
      { sender: 'Rahul', text: 'extra mayonnaise aur spicy green chutney bolna unhe' },
      { sender: 'Kunal', text: 'Swiggy pe 40% discount coupon lag raha hai, mai order kar raha' },
      { sender: 'Aman', text: 'UPI paise bhej diye check kar lo' },
    ],
  },
  {
    targetDate: new Date('2026-05-02T18:50:00.000Z'),
    topic: 'movie_outing',
    messages: [
      { sender: 'Aman', text: 'Interstellar IMAX re-release ho rahi hai, tickets book karein?' },
      { sender: 'Rahul', text: 'bhai IMAX screen 1 pe sound design is unmatched, count me in' },
      { sender: 'Neha', text: 'Saturday 7 PM show book karo, seats corner mat lena' },
      { sender: 'Simran', text: 'middle row F or G is best for immersion' },
      { sender: 'Aman', text: 'bookmyshow pe tickets fast fill ho rahi hain, book kar diya!' },
    ],
  },
  {
    targetDate: new Date('2026-03-22T21:10:00.000Z'),
    topic: 'memes_banter',
    messages: [
      { sender: 'Simran', text: 'Forwarded: prof says the exam is open book, but questions are from another dimension' },
      { sender: 'Aman', text: 'lmao relatable af' },
      { sender: 'Rahul', text: 'literally my situation in end sems 💀' },
      { sender: 'Priya', text: 'padh lo thoda meme share karne se pass nahi hoge 😂' },
    ],
  },
  {
    targetDate: new Date('2026-04-05T17:00:00.000Z'),
    topic: 'career_system_design',
    messages: [
      { sender: 'Arjun', text: 'system design basics padhna start kar do' },
      { sender: 'Kunal', text: 'Alex Xu ki System Design Interview book start ki hai maine' },
      { sender: 'Simran', text: 'caching, load balancing aur horizontal scaling clear hona chahiye' },
      { sender: 'Rahul', text: 'microservices vs monolithic architecture pe case studies dekho' },
      { sender: 'Arjun', text: 'Sunday ko ek mock design session rakhte hain rate limiter pe' },
    ],
  },
];

// Rich, expansive library of 100+ distinct realistic academic, tech, and college life subtopics
const SUBTOPICS = [
  // 1. Exams (10)
  { cat: 'exams', name: 'DBMS Normalization', sub: 'DBMS', detail: '1NF, 2NF aur BCNF decomposition' },
  { cat: 'exams', name: 'OS Deadlocks', sub: 'Operating Systems', detail: 'Banker algorithm and resource allocation graph' },
  { cat: 'exams', name: 'Computer Networks', sub: 'CN', detail: 'TCP 3-way handshake and subnet masking' },
  { cat: 'exams', name: 'Theory of Computation', sub: 'TOC', detail: 'DFA minimization and context free grammars' },
  { cat: 'exams', name: 'Compiler Design', sub: 'Compiler', detail: 'LR parsing table and syntax tree generation' },
  { cat: 'exams', name: 'Software Engineering', sub: 'SE', detail: 'Agile sprint cycles and UML class diagrams' },
  { cat: 'exams', name: 'Machine Learning Basics', sub: 'ML', detail: 'gradient descent optimization and cross-validation' },
  { cat: 'exams', name: 'Cyber Security Cryptography', sub: 'Security', detail: 'public key cryptography and RSA algorithm' },
  { cat: 'exams', name: 'Computer Architecture', sub: 'COA', detail: 'cache mapping and pipelining hazard resolution' },
  { cat: 'exams', name: 'Discrete Mathematics', sub: 'Discrete Math', detail: 'recurrence relations and graph isomorphism' },

  // 2. Assignments (10)
  { cat: 'assignments', name: 'DSA Graph Algorithm', sub: 'DSA Assignment', detail: 'Dijkstra shortest path implementation' },
  { cat: 'assignments', name: 'Web Dev Lab Authentication', sub: 'Fullstack Lab', detail: 'REST API authentication and token verification' },
  { cat: 'assignments', name: 'Cloud Computing Infrastructure', sub: 'Cloud Task', detail: 'AWS S3 bucket policy and EC2 setup' },
  { cat: 'assignments', name: 'OS Shell Script Automation', sub: 'OS Scripting', detail: 'bash automation for log rotation' },
  { cat: 'assignments', name: 'Database SQL Analytics', sub: 'SQL Assignment', detail: 'complex aggregations and window functions' },
  { cat: 'assignments', name: 'DSA Dynamic Programming Knapsack', sub: 'DP Task', detail: 'longest common subsequence memoization' },
  { cat: 'assignments', name: 'Computer Graphics OpenGL', sub: 'Graphics Lab', detail: '3D transformation matrix and shading' },
  { cat: 'assignments', name: 'Data Mining Classification', sub: 'Data Mining', detail: 'decision tree pruning and k-means clustering' },
  { cat: 'assignments', name: 'Microprocessor 8086 Assembly', sub: 'Assembly Task', detail: 'interrupt handling and string manipulation' },
  { cat: 'assignments', name: 'AI Search Algorithms', sub: 'AI Assignment', detail: 'A* search and minimax game playing' },

  // 3. College Classes (8)
  { cat: 'college_classes', name: 'Lab Attendance Criteria', sub: 'Attendance', detail: '75 percent requirement strictly check ho raha hai' },
  { cat: 'college_classes', name: 'Sharma Sir Practical Viva', sub: 'Lab Viva', detail: 'practical file checking and cross-questions' },
  { cat: 'college_classes', name: 'Lecture Hall 4 Reschedule', sub: 'Classroom Notice', detail: 'extra class scheduled in lecture hall 3' },
  { cat: 'college_classes', name: 'Library 3rd Floor Corner', sub: 'Library Study', detail: 'silent reading zone on 2nd floor' },
  { cat: 'college_classes', name: 'HOD Department Notice', sub: 'HOD Office', detail: 'departmental approval for seminar' },
  { cat: 'college_classes', name: 'Class Bunk Tea Session', sub: 'Free Period', detail: 'canteen cutting chai during 2nd period' },
  { cat: 'college_classes', name: 'Dean Office Application', sub: 'Dean Office', detail: 'medical certificate submission for leave' },
  { cat: 'college_classes', name: 'Seminar Hall Guest Talk', sub: 'Guest Lecture', detail: 'industry expert keynote on cloud native' },

  // 4. Internships (8)
  { cat: 'internships', name: 'Summer Internship Cell', sub: 'Internship Portal', detail: 'stipend 40k software engineer role' },
  { cat: 'internships', name: 'Resume ATS LaTeX Format', sub: 'Resume Review', detail: 'single page LaTeX format optimization' },
  { cat: 'internships', name: 'Google Summer of Code Proposals', sub: 'GSoC Org', detail: 'open source organization proposal draft' },
  { cat: 'internships', name: 'LinkedIn Alumni Outreach', sub: 'Referrals', detail: 'cold messaging alumni at product companies' },
  { cat: 'internships', name: 'Off-Campus Hiring Drive', sub: 'Hiring Portal', detail: 'online assessment link from Bangalore startup' },
  { cat: 'internships', name: 'Portfolio Website Showcase', sub: 'Portfolio', detail: 'deployed project links on GitHub profile' },
  { cat: 'internships', name: 'Stipend Negotiations', sub: 'Offer Letter', detail: 'housing allowance and hybrid working policy' },
  { cat: 'internships', name: 'Research Internship IIT', sub: 'Research Lab', detail: 'summer fellow program application form' },

  // 5. Coding & Projects (8)
  { cat: 'coding_projects', name: 'React Component Infinite Loop', sub: 'React Hooks', detail: 'infinite re-render loop in useEffect' },
  { cat: 'coding_projects', name: 'Express Error Middleware', sub: 'Express Backend', detail: 'error handling middleware chain' },
  { cat: 'coding_projects', name: 'Docker Compose Port Mapping', sub: 'Docker', detail: 'port mapping 5000:5000 with volume bind' },
  { cat: 'coding_projects', name: 'Git Merge Branch Conflict', sub: 'GitHub PR', detail: 'resolving branch conflicts in pull request' },
  { cat: 'coding_projects', name: 'LeetCode Biweekly Contest', sub: 'LeetCode Contest', detail: 'biweekly contest rank and rating update' },
  { cat: 'coding_projects', name: 'TypeScript Interface Types', sub: 'TypeScript', detail: 'generic type constraints and union types' },
  { cat: 'coding_projects', name: 'Redux Toolkit Store Slice', sub: 'State Management', detail: 'createSlice async thunk actions' },
  { cat: 'coding_projects', name: 'NextJS Server Components', sub: 'Server Side Rendering', detail: 'streaming SSR and layout revalidation' },

  // 6. Frontend Discussions (6)
  { cat: 'frontend_discussions', name: 'Tailwind Dark Theme Palette', sub: 'Tailwind CSS', detail: 'custom slate color palette contrast' },
  { cat: 'frontend_discussions', name: 'Vite Production Bundler', sub: 'Vite Build', detail: 'fast HMR reload and gzip compression' },
  { cat: 'frontend_discussions', name: 'Lucide Minimal SVG Icons', sub: 'Lucide React', detail: 'clean SVG icons for dashboard buttons' },
  { cat: 'frontend_discussions', name: 'Responsive Mobile Viewport Drawer', sub: 'CSS Grid', detail: 'drawer sidebar and touch navigation' },
  { cat: 'frontend_discussions', name: 'Framer Motion Transitions', sub: 'UI Animations', detail: 'spring physics and staggered layout animations' },
  { cat: 'frontend_discussions', name: 'Accessibility ARIA Labels', sub: 'Accessibility', detail: 'keyboard focus trap and screen reader labels' },

  // 7. Backend Discussions (6)
  { cat: 'backend_discussions', name: 'Node 22 Builtin Runner', sub: 'Node.js 22', detail: 'native WebSocket and test runner' },
  { cat: 'backend_discussions', name: 'Thunder Client API Payloads', sub: 'REST API', detail: 'POST request payload validation' },
  { cat: 'backend_discussions', name: 'CORS Headers Whitelist', sub: 'CORS Security', detail: 'allowed origins configuration' },
  { cat: 'backend_discussions', name: 'JWT Refresh Token Rotation', sub: 'Auth Security', detail: 'httpOnly cookie storage security' },
  { cat: 'backend_discussions', name: 'Rate Limiting Redis Store', sub: 'Rate Limiter', detail: 'sliding window request rate limiting' },
  { cat: 'backend_discussions', name: 'Zod Request Validation Schema', sub: 'Schema Validation', detail: 'input sanitization and error format' },

  // 8. Database Discussions (6)
  { cat: 'database_discussions', name: 'MongoDB Compound Vector Index', sub: 'MongoDB', detail: 'compound index on timestamp and sender' },
  { cat: 'database_discussions', name: 'PostgreSQL Relational Joins', sub: 'Database Choice', detail: 'BSON document storage for chat records' },
  { cat: 'database_discussions', name: 'Mongo Aggregation Unwind', sub: 'Aggregation Pipeline', detail: 'facet and unwind execution speed' },
  { cat: 'database_discussions', name: 'Redis In-Memory Caching', sub: 'Cache Layer', detail: 'TTL eviction policy and cache warm up' },
  { cat: 'database_discussions', name: 'Database Replica Sets', sub: 'DB Replication', detail: 'failover election and write concern' },
  { cat: 'database_discussions', name: 'Mongoose Virtual Populate', sub: 'Mongoose ODM', detail: 'foreign keys referencing and lean queries' },

  // 9. College Fest (6)
  { cat: 'college_fest', name: 'HackCon 2026 Track Announcements', sub: 'Hackathon Tracks', detail: 'tracks and prize categories' },
  { cat: 'college_fest', name: 'Corporate Sponsorship Pitch', sub: 'Fest Pitch', detail: 'pitching tech startups for prize funding' },
  { cat: 'college_fest', name: 'Main Auditorium Acoustics', sub: 'Acoustics Check', detail: 'sound check and projector setup' },
  { cat: 'college_fest', name: 'Volunteer T-Shirt Distribution', sub: 'Fest Crew', detail: 'crew badges and registration desks' },
  { cat: 'college_fest', name: 'Keynote Speaker Schedule', sub: 'Keynote Talk', detail: 'guest hospitality and itinerary' },
  { cat: 'college_fest', name: 'Event Registration Website Live', sub: 'Portal Launch', detail: 'QR code passes generation on email' },

  // 10. Winter Trip (6)
  { cat: 'winter_trip', name: 'Manali Snowfall Forecast', sub: 'Snow Trip', detail: 'packing warm jackets and thermal wear' },
  { cat: 'winter_trip', name: 'Mountain View Balcony Rates', sub: 'Room Inquiry', detail: 'balcony photos and scenic views' },
  { cat: 'winter_trip', name: 'Solang Valley Skiing Gear', sub: 'Adventure Sports', detail: 'snow boots and tube ride tickets' },
  { cat: 'winter_trip', name: 'Old Manali Riverside Cafe', sub: 'Riverside Cafe', detail: 'wood fired pizza and live music' },
  { cat: 'winter_trip', name: 'Bonfire Night Preparations', sub: 'Cottage Night', detail: 'acoustic guitar songs and marshmallows' },
  { cat: 'winter_trip', name: 'Rohtang Pass Permit Status', sub: 'Mountain Pass', detail: 'green tax permit verification online' },

  // 11. Food & Canteen (6)
  { cat: 'food_plans', name: 'Rolls King Spicy Double Egg', sub: 'Food Delivery', detail: 'double egg roll with extra chutney' },
  { cat: 'food_plans', name: 'Canteen Fresh Samosa Chai', sub: 'Canteen Hangout', detail: 'cutting chai and cheese Maggi table' },
  { cat: 'food_plans', name: 'GT Road Punjabi Dhaba', sub: 'Highway Dhaba', detail: 'butter chicken and dal makhani' },
  { cat: 'food_plans', name: 'Late Night Biryani Delivery', sub: 'Late Night Swiggy', detail: 'chicken biryani and cold drinks' },
  { cat: 'food_plans', name: 'Campus Bistro Cold Coffee', sub: 'Bistro Cafe', detail: 'thick chocolate shake and grilled sandwich' },
  { cat: 'food_plans', name: 'Hostel Room Electric Kettle Maggi', sub: 'Kettle Cooking', detail: 'butter maggi with peri peri seasoning' },

  // 12. Movies (6)
  { cat: 'movies', name: 'Interstellar IMAX Experience', sub: 'IMAX Cinema', detail: 'row F center seats IMAX re-release' },
  { cat: 'movies', name: 'Anime Episode Simulcast', sub: 'Anime Series', detail: 'new season episode release in HD' },
  { cat: 'movies', name: 'Hostel Room Projector Screening', sub: 'Room Cinema', detail: 'psychological thriller movie marathon' },
  { cat: 'movies', name: 'Marvel Avengers Teaser Breakdown', sub: 'Marvel Teaser', detail: 'post credits scene and easter eggs' },
  { cat: 'movies', name: 'Christopher Nolan Sound Design', sub: 'Film Craft', detail: 'Hans Zimmer church organ soundtrack' },
  { cat: 'movies', name: 'Weekend Cinema Tickets Booking', sub: 'BookMyShow', detail: 'recliner seats night show discount' },

  // 13. Cricket & Sports (6)
  { cat: 'cricket', name: 'Box Cricket Turf Booking', sub: 'Cricket Turf', detail: '6 to 8 PM slot under floodlights' },
  { cat: 'cricket', name: 'IPL Common Room Screening', sub: 'IPL Watch Party', detail: 'CSK vs RCB match in hostel common room' },
  { cat: 'cricket', name: 'Hostel Ground Football Kickoff', sub: 'Football Ground', detail: 'early morning 7 AM on hostel ground' },
  { cat: 'cricket', name: 'Student Sports Complex Badminton', sub: 'Badminton Court', detail: 'Yonex racquets and shuttlecock pack' },
  { cat: 'cricket', name: 'Hostel Table Tennis Match', sub: 'TT Table', detail: 'best of 5 sets table tennis championship' },
  { cat: 'cricket', name: 'Morning Lake Cycling Group', sub: 'Cycling Trek', detail: 'sunrise cycling ride around campus lake' },

  // 14. Weekend Plans (6)
  { cat: 'weekend_plans', name: 'Sunset Point Scenic Photos', sub: 'Sunset View', detail: 'scenic viewpoint sunset photos' },
  { cat: 'weekend_plans', name: 'Hostel FIFA PS5 Tournament', sub: 'FIFA Tournament', detail: 'round robin knockout league' },
  { cat: 'weekend_plans', name: 'Cafe Deep Work Coding Sprint', sub: 'Cafe Work', detail: 'laptop charging point and iced latte' },
  { cat: 'weekend_plans', name: 'Sleep Cycle Restoration Attempt', sub: 'Sleep Schedule', detail: 'no phone after 11 PM challenge' },
  { cat: 'weekend_plans', name: 'Board Game Catan Strategy Night', sub: 'Board Games', detail: 'settlers of Catan resource trading' },
  { cat: 'weekend_plans', name: 'Nearby Waterfall Trekking', sub: 'Weekend Trek', detail: 'backpack snacks and trekking shoes' },

  // 15. Birthdays (4)
  { cat: 'birthdays', name: 'Midnight Corridor Cake Cutting', sub: 'Birthday Party', detail: 'chocolate truffle cake in corridor' },
  { cat: 'birthdays', name: 'Birthday Gift Fund Contribution', sub: 'Birthday Pool', detail: '150 UPI contribution for earbuds' },
  { cat: 'birthdays', name: 'Birthday Treat Demand at Bistro', sub: 'Birthday Treat', detail: 'pizza and pasta treat for the group' },
  { cat: 'birthdays', name: 'Polaroid Photo Wall Keepsake', sub: 'Memories', detail: 'group selfie photo printouts' },

  // 16. Placements (6)
  { cat: 'placements', name: 'Weekend Peer Mock Interview', sub: 'Mock Interview', detail: 'live coding and behavioral questions' },
  { cat: 'placements', name: 'Striver SDE Sheet Dynamic Programming', sub: 'SDE Sheet', detail: 'dynamic programming on trees and graphs' },
  { cat: 'placements', name: 'System Design Rate Limiter Session', sub: 'System Design', detail: 'rate limiter and cache architecture' },
  { cat: 'placements', name: 'Placement Drive Aptitude Practice', sub: 'Aptitude Test', detail: 'speed math and logical reasoning puzzles' },
  { cat: 'placements', name: 'Core CS Fundamentals Revision', sub: 'Core CS', detail: 'DBMS normalization and OS paging concepts' },
  { cat: 'placements', name: 'Behavioral STAR Method Preparation', sub: 'HR Prep', detail: 'situation task action result storytelling' },

  // 17. Interviews (4)
  { cat: 'interviews', name: 'Fintech Startup Coding Round', sub: 'Fintech Interview', detail: 'binary search and SQL transactions' },
  { cat: 'interviews', name: 'HR Culture Fit Discussion', sub: 'HR Round', detail: 'team conflict and project challenges' },
  { cat: 'interviews', name: 'System Design Whiteboarding', sub: 'Architecture Round', detail: 'distributed message queue design' },
  { cat: 'interviews', name: 'Offer Letter CTC Breakdown', sub: 'Offer Evaluation', detail: 'base pay ESOPs and joining bonus' },

  // 18. Memes (4)
  { cat: 'memes', name: 'Engineering Exam Panic Humor', sub: 'Campus Humor', detail: 'prof surprise quiz and 404 sleep' },
  { cat: 'memes', name: 'Git Commit Bug Creation Memes', sub: 'Dev Humor', detail: 'fixed one bug created three new bugs' },
  { cat: 'memes', name: 'Code Compiles First Try Panic', sub: 'Coding Humor', detail: 'suspiciously flawless build reactions' },
  { cat: 'memes', name: 'Attendance Percentage Memes', sub: 'Hostel Memes', detail: 'calculating exact days to reach 75 percent' },

  // 19. Hostel Life (6)
  { cat: 'hostel_life', name: 'Hostel WiFi Bandwidth Congestion', sub: 'Hostel WiFi', detail: 'slow speed during peak streaming hours' },
  { cat: 'hostel_life', name: 'Mess Special Dinner Review', sub: 'Mess Dinner', detail: 'special dinner paneer and hot gulab jamun' },
  { cat: 'hostel_life', name: 'Washing Machine Queue Status', sub: 'Laundry Queue', detail: '3rd floor machine empty bucket ready' },
  { cat: 'hostel_life', name: 'Hostel Room Cooler Repair', sub: 'Cooler Service', detail: 'water pump replacement before summer heat' },
  { cat: 'hostel_life', name: 'Electric Extension Board Sharing', sub: 'Room Essentials', detail: 'extra socket for laptop chargers' },
  { cat: 'hostel_life', name: 'Room Shifting Next Semester', sub: 'Room Allotment', detail: 'ground floor corner room preference' },
];

function inferMessageType(text, topic) {
  const lower = text.toLowerCase();
  if (lower.startsWith('forwarded:')) return 'forwarded';
  if (text.length <= 18 && /^(haan|done|lol|ok|pakka|sure|nice|cool|wait|aaya|bye|deal|sorted)/i.test(lower)) {
    return 'short_reply';
  }
  if (/[😂💀😭👍🎉]/.test(text) || lower.includes('lmao') || lower.includes('relatable') || lower.includes('meme')) {
    return 'emoji';
  }
  if (lower.includes('asgmnt') || lower.includes('prbably') || lower.includes('tmrow') || lower.includes('mnali')) {
    return 'typo';
  }
  if (
    lower.includes('bhai') ||
    lower.includes('yaar') ||
    lower.includes('kya') ||
    lower.includes('hai') ||
    lower.includes('chalo') ||
    lower.includes('kar') ||
    lower.includes('raha') ||
    lower.includes('peene')
  ) {
    return 'hinglish';
  }
  return 'normal';
}

/**
 * Builds dynamic multi-turn conversation sessions where every turn
 * incorporates specific topic context to ensure near 0% repetitive duplicates.
 */
function buildConversationSession(sessionIdx, subtopic, sessionDate) {
  const messages = [];

  // Pick 3-4 distinct participants for this conversation
  const participants = shuffle(PARTICIPANTS).slice(0, randomInt(3, 4));

  // Natural context-infused openers (17 prime items)
  const openers = [
    `Guys, ${subtopic.name} check kiya kisine? ${subtopic.detail} samajh aa raha hai kya?`,
    `Bhai ${subtopic.sub} ka update dekha? ${subtopic.detail} ke baare me discuss karna tha.`,
    `Sunna, ${subtopic.name} me jo issue tha uska solution mila kya?`,
    `Anyone free for a quick discussion on ${subtopic.name}? ${subtopic.sub} discuss karna tha.`,
    `Notice board aur group pe ${subtopic.sub} se related update aaya hai: ${subtopic.detail}.`,
    `Yaar ${subtopic.name} me thoda doubt tha mujhe, ${subtopic.detail} kaise handle karein?`,
    `Group pe share kiya tha ${subtopic.name}, kisi ne practical test karke dekha?`,
    `Ek baat batao, ${subtopic.sub} ka deadline kab tak hai? ${subtopic.detail} pending hai mera.`,
    `Quick check: ${subtopic.name} kis kis ka complete ho gaya? ${subtopic.detail} verify kar lo.`,
    `Dost, ${subtopic.name} wale topic ke notes kisi ke paas hain? Especially ${subtopic.detail}.`,
    `Sab log ready hain na ${subtopic.sub} discussion ke liye? ${subtopic.name} finish karte hain.`,
    `Bhai ${subtopic.name} me runtime issue throw ho raha hai jab ${subtopic.detail} run karta hoon.`,
    `Kisine ${subtopic.sub} ke previous year questions try kiye kya?`,
    `Class me professor ne ${subtopic.name} pe special emphasis diya tha aaj.`,
    `Koi free ho to ${subtopic.sub} ke doubts resolve karwa do thode.`,
    `Final submission se pehle ${subtopic.name} ka peer review karwana hai.`,
    `Bhai ${subtopic.sub} me jo numericals aate hain uska formula sheet ready hai?`,
  ];

  // Dynamic responders 1 (19 prime items)
  const responses1 = [
    `Haan maine subah check kiya tha ${subtopic.sub} portal pe, ${subtopic.detail} show ho raha hai.`,
    `Maine try kiya tha ${subtopic.name} ke liye, kaafi smooth execution ho raha hai without errors.`,
    `Mere paas ${subtopic.sub} ke detailed notes hain, reference scan share karta hoon group pe.`,
    `Bhai abhi to ${subtopic.name} start bhi nahi kiya maine, shaam ko baithunga ${subtopic.sub} leke.`,
    `Dekh raha hoon ${subtopic.sub}, logic to straightforward lag raha hai ${subtopic.detail} ka.`,
    `Haan maine solve kiya tha ${subtopic.name}, ek simple trick lagti hai ${subtopic.detail} me.`,
    `Bilkul, 2 ghante pehle library me discuss kar rahe the hum log regarding ${subtopic.name}.`,
    `Same issue mere sath bhi aaya tha ${subtopic.sub} me kal raat ko jab compile kiya tha.`,
    `Haan dekha maine ${subtopic.sub}, professor ne format change kar diya hai ${subtopic.name} ke liye.`,
    `Mere system pe ${subtopic.name} successfully compile ho gaya tha without warnings.`,
    `Maine ${subtopic.sub} ka documentation check kiya, approach kaafi modular hai.`,
    `Haan bhai, ${subtopic.name} to 20 minute me solve ho gaya tha mera.`,
    `Seniors ne bola tha ${subtopic.detail} pe theoretical questions zyada bante hain.`,
    `Maine ek short tutorial dekha tha ${subtopic.name} pe, link drop karta hoon group pe.`,
    `Online compiler pe test kiya tha ${subtopic.sub}, execution time kaafi fast hai.`,
    `Haan maine formula sheet me ${subtopic.detail} add kar liya hai already.`,
    `Assignment submission portal pe ${subtopic.name} section active ho gaya hai.`,
    `Bhai maine kal raat 2 AM tak ${subtopic.sub} baith ke solve kiya tha.`,
    `Mere hisab se ${subtopic.name} me edge cases handle karna sabse critical part hai.`,
  ];

  // Dynamic follow-ups 2 (23 prime items)
  const responses2 = [
    `Library chalte hain saath me baith ke 1 ghante me ${subtopic.sub} wrap kar lenge.`,
    `Google Meet pe screen share karke debug kar lete hain ${subtopic.name} ka issue.`,
    `Step-by-step documentation read karo repo readme me, ${subtopic.detail} clearly mentioned hai.`,
    `Plagiarism aur similarity check dhyan me rakhna ${subtopic.sub} submit karne se pehle.`,
    `Coffee leke baithte hain hostel lawn me 15 min me to review ${subtopic.name}.`,
    `Maine ${subtopic.name} private gist pe save kiya hai, access link deta hoon check kar lo.`,
    `Formula aur edge cases verify kar lena ${subtopic.sub} me, test cases pass hone chahiye.`,
    `Previous year questions me bhi exactly ${subtopic.detail} pucha tha last semester.`,
    `Iska alternative approach bhi hai jo much faster run karta hai for ${subtopic.name}.`,
    `Seniors ne recommend kiya tha ${subtopic.sub} ko thoroughly prepare karne ke liye placement point of view se.`,
    `Haan, ${subtopic.detail} me runtime complexity minimize karni padegi.`,
    `Maine unit tests write kiye the ${subtopic.name} ke liye, coverage 95% aa raha hai.`,
    `Professor ne bola tha ki ${subtopic.sub} ke concepts viva me thoroughly puchenge.`,
    `Hostel room 304 me white board pe pura flowchart draw karke explain karta hoon for ${subtopic.name}.`,
    `Kal morning lecture se pehle 15 min me ${subtopic.name} double check kar lenge.`,
    `Ek baar sample input pe dry run karke dekh lo ${subtopic.sub} ka logic.`,
    `Repo me branch create karke PR raise kar di hai maine for ${subtopic.name}.`,
    `Haan, ${subtopic.detail} wale corner cases aksar skip ho jate hain sabse.`,
    `Slides 14 to 22 me professor ne explicitly ${subtopic.name} ka derivation diya hai.`,
    `Maine benchmark script run ki thi, memory usage kaafi optimized hai for ${subtopic.name}.`,
    `Evening tea ke time tapri pe ${subtopic.sub} quick revise kar lenge.`,
    `Format strict follow karna padega ${subtopic.name} me warna marks deduct honge.`,
    `Bhai mere system pe ${subtopic.sub} smoothly deploy ho gaya without errors.`,
  ];

  // Dynamic follow-ups 3 (19 prime items)
  const responses3 = [
    `Perfect, tab to ${subtopic.sub} easily sort ho jayega sabka bina kisi hassle ke.`,
    `Mera ${subtopic.name} unit test pass ho gaya finally, thanks for the hint guys!`,
    `Deadline se pehle upload kar dena sab ${subtopic.sub}, last minute portal crash na ho jaye.`,
    `Ek summary PDF bana ke group pe drop kar dena reference ke liye for ${subtopic.name}.`,
    `Haan shaam ko 6 baje tapri pe milke final review karte hain ${subtopic.sub} ka.`,
    `Super helpful discussion on ${subtopic.name}! Dimag me poori clarity aa gayi.`,
    `Ab lag raha hai ${subtopic.name} placement aur exam dono me bohot kaam aayega.`,
    `Great teamwork guys, aise hi sprint finish karte hain for ${subtopic.sub}.`,
    `Mast explain kiya bhai, ab ${subtopic.name} me koi doubt nahi bacha.`,
    `Maine printout nikalwa liya hai stationary shop se for ${subtopic.sub}.`,
    `Ab bas kal ke viva me confident hoke present karna hai ${subtopic.name}.`,
    `Ye wala solution repo me commit karke tag kar dena for ${subtopic.name}.`,
    `Awesome, 10 minute me submit karke free hote hain ${subtopic.sub} se.`,
    `Chalo ek bada hurdle cross hua semester ka with ${subtopic.name}!`,
    `Group study session actually worked out so well for ${subtopic.sub}.`,
    `Notes updated on cloud drive, sab access kar lena for ${subtopic.name}.`,
    `Bhai ${subtopic.name} pe to pure marks milne chahiye assignment me!`,
    `Finally done with ${subtopic.name}, ab agla module dekhte hain.`,
    `Thanks for the quick guidance guys, ${subtopic.sub} was a breeze with you all.`,
  ];

  // Dynamic closers (23 prime items)
  const closers = [
    `Done bhai, 6 PM milte hain for ${subtopic.sub} 👍`,
    `Sahi hai, ${subtopic.sub} ke liye ready rehna sab!`,
    `Theek hai ${subtopic.name} sorted, shaam ko ping kar dena.`,
    `Awesome, see you guys soon for ${subtopic.sub}!`,
    `Cool, ${subtopic.name} wrap karke nikalte hain 👍`,
    `Pakka, 10 min me reach out karta hoon for ${subtopic.sub}.`,
    `Done fir, let us rock ${subtopic.name}!`,
    `Deal, coffee on me today after ${subtopic.sub} session 😂`,
    `Perfect, logging off for now, milte hain for ${subtopic.name} 👍`,
    `Sorted hai, tension mat lo ab regarding ${subtopic.sub}!`,
    `Chalo milte hain library me for ${subtopic.sub} discussion 👍`,
    `Subah milke finalize karte hain ${subtopic.name} ko pakka.`,
    `Signing off now, raat ko call karte hain for ${subtopic.sub}.`,
    `Badiya hai, chai pe milte hain 5 PM to discuss ${subtopic.sub}!`,
    `All sorted for ${subtopic.name}, dinner ke baad ping karna.`,
    `See you in the lab guys, ready rehna for ${subtopic.sub}!`,
    `Good job everyone, ${subtopic.name} sprint completed! 🎉`,
    `Milte hain spot pe 15 minutes me for ${subtopic.sub} 👍`,
    `Ok done with ${subtopic.name}, notification off karke so raha hoon for an hour 😂`,
    `Catch you later guys, all the best for ${subtopic.sub}!`,
    `Full power, kal exam me phodenge ${subtopic.name}! 🔥`,
    `Haan bhai, ping me if anyone gets stuck in ${subtopic.sub}.`,
    `Done and dusted with ${subtopic.name}, peace out! ✌️`,
  ];

  const sessionTurns = [
    { sender: participants[0], text: openers[sessionIdx % openers.length] },
    { sender: participants[1], text: responses1[(sessionIdx * 3 + 1) % responses1.length] },
    { sender: participants[2 % participants.length], text: responses2[(sessionIdx * 5 + 2) % responses2.length] },
    { sender: participants[(sessionIdx + 1) % participants.length], text: responses3[(sessionIdx * 7 + 3) % responses3.length] },
    { sender: participants[sessionIdx % participants.length], text: closers[sessionIdx % closers.length] },
  ];

  // Optional 6th turn reaction/banter
  if (sessionIdx % 2 === 0 && participants.length > 3) {
    const banters = [
      `Haha bilkul 😂, ${subtopic.sub} sorted!`,
      `Lol relatable af 💀, ${subtopic.name} discussion is real`,
      `Engineer life in a nutshell 😂, ${subtopic.sub} rocks`,
      `Done deal 👍, milte hain for ${subtopic.name}`,
      `See you there guys for ${subtopic.sub}!`,
      `Full power chalte hain for ${subtopic.name}! 🔥`,
      `Nice, finally ${subtopic.sub} clear hua sabka`,
      `Pakka bhai, ${subtopic.name} sprint finish karte hain`,
      `Bilkul tension mat lo for ${subtopic.sub} 👍`,
      `Sahi bola, ${subtopic.name} is super important`,
      `Chai peene chalte hain after ${subtopic.sub} session ☕`,
      `Exam me full marks aayenge ${subtopic.name} me ab 😂`,
    ];
    sessionTurns.push({
      sender: participants[3],
      text: banters[(sessionIdx * 11) % banters.length],
    });
  }

  let offset = 0;
  for (const turn of sessionTurns) {
    let msgText = turn.text;
    // Occasional subtle typo
    if (rng() < 0.02 && !msgText.startsWith('Forwarded:')) {
      msgText = msgText
        .replace(/assignment/g, 'asgmnt')
        .replace(/probably/g, 'prbably')
        .replace(/tomorrow/g, 'tmrow');
    }

    const msgTime = new Date(sessionDate.getTime() + offset * 60 * 1000);
    messages.push({
      sender: turn.sender,
      message: msgText,
      timestamp: msgTime,
      embedding: [],
      threadId: null,
      messageType: inferMessageType(msgText, subtopic.cat),
      externalId: null,
    });
    offset += randomInt(1, 4);
  }

  return messages;
}

/**
 * Main synthetic chat generation function
 */
export async function generateSyntheticChat() {
  console.log('🚀 Starting Realistic Synthetic Chat Generation (Quality Pass)...');
  console.log(`👥 Participants (${PARTICIPANTS.length}):`, PARTICIPANTS.join(', '));

  const allMessages = [];

  // 1. Add canonical decision threads (total 42 messages)
  console.log('📌 Seeding 3 critical ground-truth decision threads...');
  for (const thread of DECISION_THREADS) {
    for (const item of thread.messages) {
      const msgTime = new Date(thread.startDate.getTime() + item.offsetMinutes * 60 * 1000);
      allMessages.push({
        sender: item.sender,
        message: item.message,
        timestamp: msgTime,
        embedding: [],
        threadId: thread.threadId,
        messageType: item.messageType,
        externalId: item.externalId,
      });
    }
  }

  // 2. Add canonical required evaluation conversations (total ~50 messages)
  console.log('📌 Seeding required evaluation conversation moments...');
  for (const item of REQUIRED_BENCHMARK_CONVERSATIONS) {
    let offset = 0;
    for (const msg of item.messages) {
      const msgTime = new Date(item.targetDate.getTime() + offset * 60 * 1000);
      allMessages.push({
        sender: msg.sender,
        message: msg.text,
        timestamp: msgTime,
        embedding: [],
        threadId: null,
        messageType: inferMessageType(msg.text, item.topic),
        externalId: null,
      });
      offset += randomInt(2, 5);
    }
  }

  // 3. Build diverse conversation sessions across Jan 1 – Jun 30, 2026
  const targetTotal = 4600;
  const startDate = new Date('2026-01-01T08:30:00.000Z');
  const endDate = new Date('2026-06-30T22:45:00.000Z');
  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  console.log(`💬 Generating authentic conversation sessions across ${totalDays} days to reach ${targetTotal} messages...`);

  let s = 0;
  while (allMessages.length < targetTotal) {
    const dayProgress = Math.min(0.998, s / 860);
    const sessionDayTime = startDate.getTime() + dayProgress * (endDate.getTime() - startDate.getTime());
    const sessionDate = new Date(sessionDayTime);

    // Active daily hours: 9 AM to 11 PM
    const hour = 9 + ((s % 4) * 3.4) + (rng() * 1.2);
    const minute = randomInt(0, 50);
    sessionDate.setUTCHours(Math.floor(hour), minute, randomInt(0, 55));

    const subtopic = SUBTOPICS[s % SUBTOPICS.length];
    const sessionMessages = buildConversationSession(s, subtopic, sessionDate);

    for (const msg of sessionMessages) {
      if (allMessages.length < targetTotal) {
        allMessages.push(msg);
      }
    }
    s++;
  }

  // Sort strictly chronologically
  allMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  console.log(`📊 Generated ${allMessages.length} total messages.`);
  console.log(`⏱️ Timeline: ${allMessages[0].timestamp.toISOString()} to ${allMessages[allMessages.length - 1].timestamp.toISOString()}`);

  // 4. Save to MongoDB
  const connected = await connectDB();
  if (!connected) {
    throw new Error('Could not connect to MongoDB.');
  }

  try {
    console.log('🧹 Clearing previous chat messages in MongoDB...');
    await Message.deleteMany({});

    console.log(`💾 Inserting ${allMessages.length} messages into MongoDB...`);
    const batchSize = 500;
    for (let i = 0; i < allMessages.length; i += batchSize) {
      const chunk = allMessages.slice(i, i + batchSize);
      await Message.insertMany(chunk, { ordered: false });
      console.log(`   Saved ${Math.min(i + batchSize, allMessages.length)} / ${allMessages.length} messages...`);
    }

    const totalInDb = await Message.countDocuments();
    const sendersInDb = await Message.distinct('sender');
    const decisionThreadsInDb = await Message.distinct('threadId', { threadId: { $ne: null } });

    console.log('\n============================================================');
    console.log('🎉 Realistic Chat Generation Completed!');
    console.log(`Total messages in MongoDB: ${totalInDb}`);
    console.log(`Participants: ${sendersInDb.join(', ')}`);
    console.log(`Decision threads: ${decisionThreadsInDb.join(', ')}`);
    console.log('============================================================\n');
  } finally {
    await disconnectDB();
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateSyntheticChat()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Fatal error during chat generation:', err);
      process.exit(1);
    });
}

export default generateSyntheticChat;
