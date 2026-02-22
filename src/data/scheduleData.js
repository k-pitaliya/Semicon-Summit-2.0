import {
    Users, Award, Zap, Lightbulb, Cpu, Code,
    Trophy, Target, Coffee, UtensilsCrossed, Mic, PartyPopper
} from 'lucide-react';

// ─── IMAGE MAPPING ─────────────────────────────────
// Paths match verified posters in /public/images/posters/ (same as Events.jsx)
export const EVENT_IMAGES = {
    'panel-discussion': '/images/posters/fabless-startups.jpg',
    'rtl-gds-workshop': '/images/posters/rtl-to-gds.jpg',
    'verilog-fpga-workshop': '/images/posters/verilog-fpga.jpg',
    'embedded-vlsi': '/images/posters/embedded-vs-vlsi.jpg',
    'silicon-shark-tank': '/images/posters/silicon-shark-tank.jpg',
    'wafer-chip-demo': '/images/posters/wafer-to-chip.jpg',
    'ai-vlsi': '/images/posters/ai-in-vlsi.jpg',
    'silicon-jackpot': '/images/posters/silicon-jackpot.jpg',
    'tech-engagement': '/images/posters/silicon-playzone.jpg',
    'gallery-walk': '/images/posters/silicon-ideas-showcase.jpg',
};

// ─── ICON MAP ──────────────────────────────────────
export const ICON_MAP = {
    'panel-discussion': Users,
    'rtl-gds-workshop': Code,
    'verilog-fpga-workshop': Cpu,
    'embedded-vlsi': Lightbulb,
    'silicon-shark-tank': Trophy,
    'wafer-chip-demo': Zap,
    'gallery-walk': Award,
    'ai-vlsi': Target,
    'silicon-jackpot': Award,
    'tech-engagement': Zap,
};

// ─── COMPLETE EVENT DATA (clickable events with cards) ──────
export const EVENTS_DATA = [
    {
        id: 'panel-discussion',
        name: 'Fabless Startups and Fabless MSMEs',
        subtitle: 'Amazing Semiconductor Growth',
        tagline: 'Shaping the Future of Silicon',
        description: 'Panel discussion on fabless startups and MSMEs in semiconductor industry',
        fullDescription: 'Join industry leaders for an insightful panel discussion on the rise of fabless startups and MSMEs in the semiconductor ecosystem. Explore business models, challenges, opportunities, and the future of fabless semiconductor companies in India.',
        day: 'Day 1',
        date: 'March 17, 2026',
        weekday: 'Tuesday',
        time: '11:30 AM – 12:30 PM',
        venue: 'Seminar Hall, First Floor, Electronics and Communication Department (A6 Building)',
        category: 'Panel Discussion',
        color: '#3b82f6',
        highlights: [
            'Fabless business model insights',
            'Startup ecosystem in semiconductors',
            'MSME opportunities and challenges',
            'Industry expert panel',
            'Interactive Q&A session'
        ],
        rules: [
            'Open to all registered participants',
            'Questions can be submitted during the session',
            'Active participation is encouraged'
        ],
        prerequisites: 'None – Open to all'
    },
    {
        id: 'rtl-gds-workshop',
        name: 'RTL to GDS II (Open Source)',
        tagline: 'Ready to Design Your Own Chip?',
        description: 'Hands-on workshop on the complete RTL to GDS II flow using open-source EDA tools - For 3rd and 4th year students',
        fullDescription: 'Learn the complete chip design flow from RTL (Register Transfer Level) to GDSII using cutting-edge open-source EDA tools. This hands-on workshop covers the entire ASIC design flow including synthesis, place and route, and verification. This workshop is specifically designed for 3rd and 4th year students.',
        day: 'Day 1',
        date: 'March 17, 2026',
        weekday: 'Tuesday',
        time: '01:30 PM – 04:30 PM',
        venue: 'Seminar Hall, First Floor, Electronics and Communication Department (A6 Building)',
        category: 'Hands-on Workshop',
        color: '#8b5cf6',
        highlights: [
            'Complete RTL to GDSII flow',
            'Open-source EDA tools (OpenROAD, Yosys)',
            'Synthesis and Place & Route',
            'Timing analysis and verification',
            'Hands-on practical sessions'
        ],
        rules: [
            'Specifically for 3rd and 4th year students only',
            'Bring your own laptop with required software pre-installed',
            'Basic Verilog knowledge is mandatory'
        ],
        prerequisites: 'Basic knowledge of digital design and Verilog - For 3rd and 4th year students'
    },
    {
        id: 'verilog-fpga-workshop',
        name: 'Getting Started with Verilog and FPGA',
        tagline: 'Concepts Become Circuits',
        description: 'Hands-on workshop for beginners covering Verilog HDL fundamentals and FPGA programming',
        fullDescription: 'Perfect for beginners! Learn the fundamentals of Verilog HDL and FPGA development. This hands-on workshop covers Verilog syntax, combinational and sequential logic, and implementing designs on real FPGA hardware.',
        day: 'Day 1',
        date: 'March 17, 2026',
        weekday: 'Tuesday',
        time: '01:30 PM – 04:30 PM',
        venue: 'Lab No: 231, First Floor, Electronics and Communication Department (A6 Building)',
        category: 'Hands-on Workshop',
        color: '#8b5cf6',
        highlights: [
            'Verilog HDL fundamentals',
            'Combinational and sequential circuits',
            'FPGA architecture basics',
            'Hands-on FPGA programming',
            'Real hardware implementation'
        ],
        rules: [
            'Restricted to First and Second Year students only',
            'Bring your own laptop',
            'No prior Verilog experience needed'
        ],
        prerequisites: 'Basic digital electronics knowledge (for 3rd/4th semester students)'
    },
    {
        id: 'embedded-vlsi',
        name: 'Embedded vs VLSI — What Should I Choose?',
        tagline: 'Navigate Your Career Path',
        description: 'Career guidance session on choosing between embedded systems and VLSI',
        fullDescription: 'Confused about choosing between embedded systems and VLSI career paths? This insight session provides comprehensive guidance on both domains — career prospects, required skills, industry trends, and how to make the right choice based on your interests and strengths.',
        day: 'Day 2',
        date: 'March 18, 2026',
        weekday: 'Wednesday',
        time: '09:45 AM – 11:00 AM',
        venue: 'Seminar Hall, EC Department (A6 Building)',
        category: 'Insight Session',
        color: '#f59e0b',
        highlights: [
            'Career path comparison',
            'Industry demand and trends',
            'Required skill sets for each domain',
            'Job roles and opportunities',
            'Expert career guidance'
        ],
        rules: [
            'Open to all registered participants',
            'Especially valuable for 2nd and 3rd year students',
            'Bring your questions about career paths'
        ],
        prerequisites: 'None – Especially valuable for 2nd and 3rd year students'
    },
    {
        id: 'silicon-shark-tank',
        name: 'Silicon Shark Tank',
        tagline: 'Think. Prepare. Pitch. Convince.',
        description: 'Industry-interactive innovation and idea-pitching event with live presentations to expert jury',
        fullDescription: 'This competition is open to undergraduate engineering students, with a maximum of two members per team. Cross-department participation is encouraged, and each team must nominate one Team Leader for official communication. Teams are required to pitch original, innovation-driven ideas related to Semiconductor Design & Technology, VLSI (RTL to GDS, Physical Design, Verification), Embedded Systems & FPGA-based solutions, Hardware–Software Co-Design, AI/ML Accelerators & Edge Computing, Low-Power and High-Performance Design, Semiconductor Manufacturing Challenges, EDA Tools & Automation, or Smart Electronic/System-Level solutions. AI-generated or plagiarized content is strictly prohibited and may lead to disqualification. The event consists of two rounds. In Round 1 (Idea Screening), teams must submit an original idea (maximum 200 words) clearly outlining the problem statement, existing system loopholes, proposed solution, application/use-case, innovation aspect, technical domain (VLSI-focused), and a supporting visual such as a block diagram, mind map, or execution flow. Shortlisted teams will advance to Round 2, where they will deliver a 10-minute live pitch (7-minute presentation + 3-minute Q&A) before an expert jury; slides and system architecture diagrams are allowed, while a working demo is not mandatory. Final evaluation will be conducted solely by the expert jury, and their decision will be final and binding. Selected teams will receive internship opportunities (per team), industry mentorship, and technical feedback for idea refinement; however, no cash prize or financial funding will be provided. All eligible participants will receive participation certificates and digital badges, and winners will be awarded a free industry internship. Professional conduct, strict adherence to time limits, and originality are mandatory throughout the competition, and organizers reserve the right to modify rules if required.',
        day: 'Day 2',
        date: 'March 18, 2026',
        weekday: 'Wednesday',
        time: '12:30 PM – 04:30 PM',
        venue: 'Seminar Hall, First Floor, Electronics and Communication Department (A6 Building)',
        category: 'Industry-Driven Idea Pitching',
        color: '#ef4444',
        highlights: [
            'Pitch innovative semiconductor ideas to industry experts',
            'Real-world industry pitch simulation',
            'Internship opportunities for selected teams',
            'Industry mentorship and guidance',
            'Technical feedback for idea refinement'
        ],
        themes: [
            'Semiconductor Design & Technology',
            'VLSI Design (RTL to GDS, Physical Design, Verification)',
            'Embedded Systems & FPGA-based Solutions',
            'Hardware–Software Co-Design',
            'AI / ML Accelerators & Edge Computing',
            'Low-Power & High-Performance Design',
            'Semiconductor Manufacturing Challenges',
            'EDA Tools, Automation & Innovation',
            'Smart Electronic & System-Level Solutions'
        ],
        eventStructure: [
            {
                round: 'Round 1: Idea Submission (Screening Round)',
                details: [
                    'Idea submission must be original — AI-generated content is strictly not allowed',
                    'Word limit: Maximum 200 words',
                    'Must include: Problem statement, existing system loopholes, proposed solution, application/use-case, innovation aspect, technical domain (VLSI-focused)',
                    'Supporting visuals (block diagram, mind map, or execution flow) required',
                    'Ideas must be plagiarism-free',
                    'Outcome: Shortlisting of teams for Round 2'
                ]
            },
            {
                round: 'Round 2: Live Pitch to Industry Experts',
                details: [
                    'Shortlisted teams present live before an expert jury',
                    'Pitch Duration: 10 minutes per team (7 min presentation + 3 min Q&A)',
                    'Use slides, block diagrams, or system architecture',
                    'Working demo is not mandatory'
                ]
            }
        ],
        judgingCriteria: [
            { criteria: 'Problem Relevance', marks: 8 },
            { criteria: 'Technical Depth', marks: 10 },
            { criteria: 'Innovation & Originality', marks: 10 },
            { criteria: 'Feasibility', marks: 8 },
            { criteria: 'Application Impact', marks: 5 },
            { criteria: 'Presentation & Communication', marks: 5 },
            { criteria: 'Q&A Handling', marks: 4 },
        ],
        rules: [
            'Team size: Maximum 2 students per team',
            'Cross-department teams are allowed and encouraged',
            'Each team must nominate one Team Leader for official communication',
            'Ideas must be original and not copied from existing products or published projects',
            'Reference to existing research is allowed with clear mention of innovation',
            'AI-generated ideas and plagiarized content will lead to immediate disqualification',
            'Strict adherence to time limits is mandatory',
            'Professional and ethical conduct is expected at all stages',
            'No financial funding or cash prize will be provided',
            'Organizers reserve the right to modify rules if required'
        ],
        certificates: [
            'Participation certificates for all eligible participants',
            'Excellence / Shortlisting certificates for selected teams'
        ],
        prerequisites: 'Open to undergraduate and postgraduate engineering students. Prepare your idea submission.'
    },
    {
        id: 'wafer-chip-demo',
        name: 'Wafer to Chip Demonstration by Monk9',
        tagline: 'From Sand to Silicon',
        description: 'Live demonstration of semiconductor manufacturing — from wafer fabrication to final chip',
        fullDescription: 'Witness the complete semiconductor manufacturing journey from wafer to chip! Monk9 Technologies presents a live demonstration showcasing the intricate steps of chip fabrication, packaging, and testing. A rare opportunity to see the hardware side of semiconductors up close.',
        day: 'Day 2',
        date: 'March 18, 2026',
        weekday: 'Wednesday',
        time: '12:30 PM – 04:30 PM',
        venue: 'Left Side Lawn, Ground Floor, Electronics and Communication Department (A6 Building)',
        category: 'Stall Visit & Demo',
        color: '#10b981',
        highlights: [
            'Live chip manufacturing demonstration',
            'Wafer fabrication process explained',
            'Packaging and testing stages',
            'Industry equipment showcase',
            'Interactive Q&A with Monk9 team'
        ],
        rules: [
            'Open to all registered participants',
            'Follow safety guidelines at the stall',
            'Do not touch equipment without permission'
        ],
        prerequisites: 'None – Open to all'
    },
    {
        id: 'gallery-walk',
        name: 'Silent Silicon Ideas Gallery Walk',
        tagline: 'Ideas Shaped in Silicon',
        description: 'Exhibition of student projects, research posters, and semiconductor innovations',
        fullDescription: 'Explore innovative projects and ideas from students and participants! The Silent Silicon Ideas Gallery showcases creative semiconductor projects, research posters, and innovative designs. Walk through a gallery where ideas become insight and creativity meets silicon.',
        day: 'Day 2',
        date: 'March 18, 2026',
        weekday: 'Wednesday',
        time: '12:30 PM – 04:30 PM',
        venue: 'Electronics and Communication Department (A6 Building)',
        category: 'Gallery Walk & Exhibition',
        color: '#06b6d4',
        highlights: [
            'Student project exhibitions',
            'Innovative chip design showcases',
            'Research poster presentations',
            'Peer learning opportunities',
            'Networking with innovators'
        ],
        rules: [
            'Open to all participants and exhibitors',
            'Exhibitors must set up posters by 12:00 PM',
            'Maintain silence during the gallery walk'
        ],
        prerequisites: 'None – Open to all participants and exhibitors'
    },
    {
        id: 'ai-vlsi',
        name: 'AI in VLSI: Will it Change or Replace the VLSI Engineer?',
        tagline: 'Transforming the Engineer — Not Replacing Them',
        description: 'Exploring the impact of AI on VLSI design and engineering careers',
        fullDescription: 'Explore how artificial intelligence is transforming VLSI design. Will AI replace VLSI engineers or become a powerful tool? This session discusses AI-driven EDA tools, machine learning in chip design, and the future role of VLSI engineers in an AI-enhanced world.',
        day: 'Day 3',
        date: 'March 19, 2026',
        weekday: 'Thursday',
        time: '09:45 AM – 11:00 AM',
        venue: 'Seminar Hall, EC Department (A6 Building)',
        category: 'Insight Session',
        color: '#f59e0b',
        highlights: [
            'AI in chip design workflows',
            'Machine-learning-driven EDA tools',
            'Future of VLSI engineering careers',
            'Human-AI collaboration in design',
            'Industry perspectives and Q&A'
        ],
        rules: [
            'Open to all registered participants',
            'Q&A session at the end',
            'Career guidance included'
        ],
        prerequisites: 'None – Open to all'
    },
    {
        id: 'silicon-jackpot',
        name: 'The Silicon Jackpot',
        subtitle: 'Technical Treasure Hunt',
        tagline: 'Decode the Logic. Hunt the Clues. Complete the Silicon.',
        description: 'A multi-stage technical treasure challenge testing semiconductor fundamentals and digital systems',
        fullDescription: 'The Silicon Jackpot – "Decode the Logic. Hunt the Clues. Complete the Silicon." is a multi-stage technical treasure challenge designed to test students in semiconductor fundamentals and digital systems through knowledge, speed, collaboration, and practical implementation. The event unfolds across three progressive rounds where participants unlock clues, collect technical flags, and ultimately complete the word VLSI, symbolizing mastery in Very Large Scale Integration. Round 1, The Silicon Screening – Flag Hunt, is conducted separately for First Year, Second Year, and Third Year students, each receiving curriculum-based technical questions aligned with their academic level. Participants must solve the problem to unlock the first flag containing the letter "V" and a location clue. From each year, the first students to successfully complete the challenge qualify. These qualifiers are then grouped into interdisciplinary teams consisting of one student from each academic year, forming balanced teams. This round evaluates conceptual clarity, speed, accuracy, and individual problem-solving ability. Round 2, The Logic Conquest – Unified Challenge, brings the 20 teams together at a common location where they face a shared technical problem focused on applied digital logic, analytical reasoning, and teamwork. Upon solving the challenge, teams receive the second flag containing the letter "L" and additional clues to collect the letter "S." Based on accuracy and completion time, only the top teams advance to the final round. This stage assesses collaborative thinking, logical structuring, time management, and technical communication. Round 3, Kaun Banega Summit Samrat – The FPGA Finale, is a KBC-inspired technical showdown where the top 5 teams compete in an FPGA-based quiz featuring progressively complex digital electronics and Verilog questions. Successful teams collect the final flag containing the letter "I," completing the word VLSI. This finale evaluates practical HDL knowledge, hardware understanding, debugging skills, and performance under pressure. The team that excels across all stages and performs best in the FPGA finale will be crowned the Summit Samrat of Silicon, symbolizing their journey from V → L → S → I and their technical excellence in the semiconductor domain.',
        day: 'Day 3',
        date: 'March 19, 2026',
        weekday: 'Thursday',
        time: '12:10 PM – 03:30 PM',
        venue: 'Foyer, Electronics and Communication Department (A6 Building)',
        category: 'Technical Treasure Hunt',
        color: '#ec4899',
        highlights: [
            'Semiconductor-themed puzzles',
            'Team-based campus-wide competition',
            'Aptitude + Basic Digital Logic rounds',
            'Live Aptitude, Digital & Verilog on FPGA',
            'Exciting prizes for winners'
        ],
        rules: [
            'Form teams of 3–4 members',
            'Solve questions → Collect flags to advance',
            'All team members must be registered participants',
            'Use of mobile phones for internet search is prohibited during rounds'
        ],
        prerequisites: 'Form teams of 3–4 members before the event'
    },
    {
        id: 'tech-engagement',
        name: 'Silicon PlayZone',
        subtitle: 'Problem-Solving Challenges & Tech Games',
        tagline: 'Learn. Play. Innovate.',
        description: 'Fun technical games and problem-solving challenges for all participants',
        fullDescription: 'Participate in a variety of technical challenges and tech games! From circuit debugging to algorithm challenges, these interactive activities combine learning with fun. Perfect for applying your technical knowledge in creative and competitive ways.',
        day: 'Day 3',
        date: 'March 19, 2026',
        weekday: 'Thursday',
        time: '12:10 PM – 03:30 PM',
        venue: 'Activity Zones, Electronics and Communication Department (A6 Building)',
        category: 'Problem-Solving Challenges',
        color: '#14b8a6',
        highlights: [
            'Technical games and challenges',
            'Circuit debugging activities',
            'Algorithmic problem solving',
            'Interactive learning experiences',
            'Individual and team competitions'
        ],
        rules: [
            'Open to all registered participants',
            'Individual and team events available',
            'Follow coordinator instructions at each station'
        ],
        prerequisites: 'None – Open to all'
    }
];

// ─── FULL SCHEDULE WITH BREAKS ─────────────────────
export const FULL_SCHEDULE = {
    'Day 1': [
        { type: 'break', time: '09:15 AM – 10:30 AM', title: 'Welcome of Guests & Refreshments ☕', icon: Coffee, color: '#22c55e' },
        { type: 'ceremony', time: '10:30 AM – 10:50 AM', title: 'Summit Inaugural Proceedings', icon: Mic, color: '#3b82f6', venue: 'Seminar Hall, First Floor, Electronics and Communication Department (A6 Building)', description: 'Official inaugural proceedings of Semiconductor Summit 2.0.' },
        { type: 'ceremony', time: '10:50 AM – 11:30 AM', title: 'Inaugural Talk', icon: Mic, color: '#8b5cf6', venue: 'Seminar Hall, First Floor, Electronics and Communication Department (A6 Building)', description: 'The inaugural keynote talk of Semiconductor Summit 2.0, setting the stage for three days of learning, innovation, and industry interaction.' },
        { type: 'event', eventId: 'panel-discussion' },
        { type: 'break', time: '12:30 PM – 01:30 PM', title: 'Networking Break 🤝', icon: UtensilsCrossed, color: '#f97316' },
        { type: 'event', eventId: 'rtl-gds-workshop' },
        { type: 'event', eventId: 'verilog-fpga-workshop' },
    ],
    'Day 2': [
        { type: 'break', time: '09:00 AM – 09:30 AM', title: 'Refreshment ☕', icon: Coffee, color: '#a78bfa' },
        { type: 'event', eventId: 'embedded-vlsi' },
        { type: 'break', time: '11:00 AM – 12:10 PM', title: 'Networking Break 🤝', icon: UtensilsCrossed, color: '#f97316' },
        { type: 'event', eventId: 'silicon-shark-tank' },
        { type: 'event', eventId: 'wafer-chip-demo' },
        { type: 'event', eventId: 'gallery-walk' },
    ],
    'Day 3': [
        { type: 'break', time: '09:00 AM – 09:30 AM', title: 'Refreshment ☕', icon: Coffee, color: '#a78bfa' },
        { type: 'event', eventId: 'ai-vlsi' },
        { type: 'break', time: '11:00 AM – 12:00 Noon', title: 'Networking Break 🤝', icon: UtensilsCrossed, color: '#f97316' },
        { type: 'event', eventId: 'silicon-jackpot' },
        { type: 'event', eventId: 'tech-engagement' },
        { type: 'ceremony', time: '03:30 PM – 04:30 PM', title: 'Awards & Closing Ceremony 🏆', icon: PartyPopper, color: '#f59e0b', venue: 'Seminar Hall, Electronics and Communication Department (A6 Building)', description: 'The grand closing ceremony featuring prize distribution, certificates, recognition of outstanding participants, and a summary of the summit highlights.' },
    ],
};

// ─── EVENTS LOOKUP MAP ─────────────────────────────
export const EVENTS_MAP = {};
EVENTS_DATA.forEach(ev => { EVENTS_MAP[ev.id] = ev; });

// ─── DAY INFO ──────────────────────────────────────
export const DAYS = [
    { id: 'Day 1', label: 'Day 1', date: 'March 17', weekday: 'Tuesday', color: '#3b82f6' },
    { id: 'Day 2', label: 'Day 2', date: 'March 18', weekday: 'Wednesday', color: '#8b5cf6' },
    { id: 'Day 3', label: 'Day 3', date: 'March 19', weekday: 'Thursday', color: '#ec4899' },
];
