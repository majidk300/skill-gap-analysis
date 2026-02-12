import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Target, TrendingUp, BookOpen, Award, ArrowRight, CheckCircle, AlertCircle, Download, Brain, Code, Zap, Clock, ChevronRight } from 'lucide-react';

const SkillGapDiagnosisTool = () => {
    const [step, setStep] = useState('intro');
    const [userData, setUserData] = useState({
        name: '',
        currentRole: '',
        targetRole: '',
        industry: '',
        experience: '',
        selectedTechnologies: []
    });

    const [quizData, setQuizData] = useState({
        technologyQuizzes: [], // Array of quizzes for each technology
        currentQuizIndex: 0,
        currentQuestionIndex: 0,
        answers: {},
        skillScores: {},
        totalQuestions: 0
    });

    const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
    const [results, setResults] = useState(null);
    const [githubQuestions, setGithubQuestions] = useState(null);
    const [loadingGithubData, setLoadingGithubData] = useState(false);
    const [githubError, setGithubError] = useState(null);

    // Load questions from GitHub on component mount
    useEffect(() => {
        loadGithubQuestions();
    }, []);

    const loadGithubQuestions = async () => {
        setLoadingGithubData(true);
        setGithubError(null);

        try {
            const response = await fetch('https://raw.githubusercontent.com/majidk300/skillgap-data/main/questions.json');
            
            if (!response.ok) {
                throw new Error('Failed to load questions from GitHub');
            }
            
            const data = await response.json();
            setGithubQuestions(data);
            console.log('Successfully loaded questions from GitHub:', data);
        } catch (error) {
            console.error('Error loading GitHub questions:', error);
            setGithubError(error.message);
        } finally {
            setLoadingGithubData(false);
        }
    };

    // Technology options by role
    const technologyOptions = {
        'Software Developer': [
            { id: 'javascript', name: 'JavaScript/TypeScript', icon: '🟨' },
            { id: 'python', name: 'Python', icon: '🐍' },
            { id: 'java', name: 'Java', icon: '☕' },
            { id: 'react', name: 'React', icon: '⚛️' },
            { id: 'nodejs', name: 'Node.js', icon: '🟢' },
            { id: 'sql', name: 'SQL/Databases', icon: '🗄️' },
            { id: 'git', name: 'Git/Version Control', icon: '📚' },
            { id: 'aws', name: 'AWS/Cloud', icon: '☁️' },
            { id: 'docker', name: 'Docker/Kubernetes', icon: '🐳' },
            { id: 'testing', name: 'Testing/QA', icon: '✅' }
        ],
        'Data Scientist': [
            { id: 'python', name: 'Python', icon: '🐍' },
            { id: 'r', name: 'R Programming', icon: '📊' },
            { id: 'ml', name: 'Machine Learning', icon: '🤖' },
            { id: 'stats', name: 'Statistics', icon: '📈' },
            { id: 'sql', name: 'SQL', icon: '🗄️' },
            { id: 'pandas', name: 'Pandas/NumPy', icon: '🐼' },
            { id: 'visualization', name: 'Data Visualization', icon: '📉' },
            { id: 'deeplearning', name: 'Deep Learning', icon: '🧠' },
            { id: 'bigdata', name: 'Big Data (Spark)', icon: '⚡' },
            { id: 'nlp', name: 'NLP', icon: '💬' }
        ],
        'Product Manager': [
            { id: 'analytics', name: 'Product Analytics', icon: '📊' },
            { id: 'roadmap', name: 'Roadmap Planning', icon: '🗺️' },
            { id: 'userresearch', name: 'User Research', icon: '🔍' },
            { id: 'agile', name: 'Agile/Scrum', icon: '🔄' },
            { id: 'wireframing', name: 'Wireframing', icon: '📱' },
            { id: 'abtesting', name: 'A/B Testing', icon: '🧪' },
            { id: 'sql', name: 'SQL/Data Analysis', icon: '🗄️' },
            { id: 'jira', name: 'Jira/PM Tools', icon: '📋' },
            { id: 'strategy', name: 'Product Strategy', icon: '🎯' },
            { id: 'stakeholder', name: 'Stakeholder Mgmt', icon: '🤝' }
        ],
        'UX/UI Designer': [
            { id: 'figma', name: 'Figma', icon: '🎨' },
            { id: 'sketch', name: 'Sketch', icon: '✏️' },
            { id: 'adobe', name: 'Adobe XD', icon: '🅰️' },
            { id: 'userresearch', name: 'User Research', icon: '🔍' },
            { id: 'prototyping', name: 'Prototyping', icon: '📱' },
            { id: 'designsystems', name: 'Design Systems', icon: '🧩' },
            { id: 'usability', name: 'Usability Testing', icon: '✅' },
            { id: 'interaction', name: 'Interaction Design', icon: '🖱️' },
            { id: 'htmlcss', name: 'HTML/CSS', icon: '💻' },
            { id: 'accessibility', name: 'Accessibility', icon: '♿' }
        ],
        'Digital Marketing Manager': [
            { id: 'seo', name: 'SEO', icon: '🔍' },
            { id: 'sem', name: 'Google Ads/SEM', icon: '💰' },
            { id: 'analytics', name: 'Google Analytics', icon: '📊' },
            { id: 'social', name: 'Social Media Marketing', icon: '📱' },
            { id: 'email', name: 'Email Marketing', icon: '📧' },
            { id: 'content', name: 'Content Marketing', icon: '✍️' },
            { id: 'automation', name: 'Marketing Automation', icon: '🤖' },
            { id: 'cro', name: 'CRO', icon: '📈' },
            { id: 'ppc', name: 'PPC Advertising', icon: '💵' },
            { id: 'facebook', name: 'Facebook Ads', icon: '👥' }
        ],
        'Business Analyst': [
            { id: 'excel', name: 'Excel/Spreadsheets', icon: '📊' },
            { id: 'sql', name: 'SQL', icon: '🗄️' },
            { id: 'powerbi', name: 'Power BI', icon: '📈' },
            { id: 'tableau', name: 'Tableau', icon: '📉' },
            { id: 'requirements', name: 'Requirements Gathering', icon: '📋' },
            { id: 'processmodeling', name: 'Process Modeling', icon: '🔄' },
            { id: 'financial', name: 'Financial Analysis', icon: '💰' },
            { id: 'documentation', name: 'Documentation', icon: '📝' },
            { id: 'jira', name: 'Jira', icon: '📌' },
            { id: 'statistics', name: 'Statistics', icon: '📊' }
        ]
    };

    // Skill categories structure
    const skillCategories = {
        'Software Developer': {
            'Technical Skills': [
                'Programming Fundamentals',
                'Data Structures & Algorithms',
                'Web Development',
                'Backend Development',
                'Database Management',
                'Version Control',
                'Cloud & DevOps',
                'Testing & Quality Assurance'
            ],
            'Soft Skills': [
                'Problem Solving',
                'Communication',
                'Teamwork',
                'Time Management'
            ]
        },
        'Data Scientist': {
            'Technical Skills': [
                'Programming',
                'Statistics & Probability',
                'Machine Learning',
                'Data Manipulation',
                'Data Visualization',
                'Big Data Technologies',
                'Deep Learning',
                'Feature Engineering'
            ],
            'Soft Skills': [
                'Business Acumen',
                'Communication',
                'Critical Thinking',
                'Problem Solving'
            ]
        },
        'Product Manager': {
            'Technical Skills': [
                'Product Strategy',
                'User Research',
                'Data Analytics',
                'Roadmap Planning',
                'A/B Testing',
                'Wireframing',
                'Agile Methodologies',
                'Market Analysis'
            ],
            'Soft Skills': [
                'Leadership',
                'Communication',
                'Stakeholder Management',
                'Decision Making',
                'Negotiation',
                'Strategic Thinking'
            ]
        },
        'UX/UI Designer': {
            'Technical Skills': [
                'Design Tools',
                'User Research',
                'Wireframing & Prototyping',
                'Interaction Design',
                'Visual Design',
                'Design Systems',
                'Usability Testing',
                'Basic Frontend'
            ],
            'Soft Skills': [
                'Creativity',
                'Communication',
                'Empathy',
                'Problem Solving',
                'Collaboration',
                'Attention to Detail'
            ]
        },
        'Digital Marketing Manager': {
            'Technical Skills': [
                'SEO/SEM',
                'Analytics & Reporting',
                'Social Media Marketing',
                'Content Marketing',
                'Email Marketing',
                'Marketing Automation',
                'PPC Advertising',
                'Conversion Optimization'
            ],
            'Soft Skills': [
                'Creativity',
                'Communication',
                'Analytical Thinking',
                'Project Management',
                'Strategic Planning',
                'Adaptability'
            ]
        },
        'Business Analyst': {
            'Technical Skills': [
                'Data Analysis',
                'Business Intelligence',
                'Process Modeling',
                'Requirements Gathering',
                'Financial Analysis',
                'Documentation',
                'SQL & Databases',
                'Reporting Tools'
            ],
            'Soft Skills': [
                'Communication',
                'Problem Solving',
                'Critical Thinking',
                'Stakeholder Management',
                'Business Acumen',
                'Attention to Detail'
            ]
        }
    };

    const benchmarkScores = {
        'entry': { min: 2.0, target: 3.0 },
        'intermediate': { min: 3.0, target: 4.0 },
        'senior': { min: 4.0, target: 4.5 },
        'expert': { min: 4.5, target: 5.0 }
    };

    // Map technology IDs to category names in GitHub JSON
    const techToCategoryMap = {
        'javascript': 'JavaScript/TypeScript',
        'python': 'Python',
        'java': 'Java',
        'react': 'React',
        'nodejs': 'Node.js',
        'sql': 'SQL/Databases',
        'git': 'Git/Version Control',
        'aws': 'AWS/Cloud',
        'docker': 'Docker/Kubernetes',
        'testing': 'Testing/QA',
        'r': 'R Programming',
        'ml': 'Machine Learning',
        'stats': 'Statistics',
        'pandas': 'Pandas/NumPy',
        'visualization': 'Data Visualization',
        'deeplearning': 'Deep Learning',
        'bigdata': 'Big Data',
        'nlp': 'NLP',
        'analytics': 'Product Analytics',
        'roadmap': 'Roadmap Planning',
        'userresearch': 'User Research',
        'agile': 'Agile/Scrum',
        'wireframing': 'Wireframing',
        'abtesting': 'A/B Testing',
        'jira': 'Jira',
        'strategy': 'Product Strategy',
        'stakeholder': 'Stakeholder Management',
        'figma': 'Figma',
        'sketch': 'Sketch',
        'adobe': 'Adobe XD',
        'prototyping': 'Prototyping',
        'designsystems': 'Design Systems',
        'usability': 'Usability Testing',
        'interaction': 'Interaction Design',
        'htmlcss': 'HTML/CSS',
        'accessibility': 'Accessibility',
        'seo': 'SEO',
        'sem': 'SEM',
        'email': 'Email Marketing',
        'content': 'Content Marketing',
        'automation': 'Marketing Automation',
        'cro': 'CRO',
        'ppc': 'PPC',
        'facebook': 'Facebook Ads',
        'excel': 'Excel',
        'powerbi': 'Power BI',
        'tableau': 'Tableau',
        'requirements': 'Requirements Gathering',
        'processmodeling': 'Process Modeling',
        'financial': 'Financial Analysis',
        'documentation': 'Documentation'
    };

    // Get questions from GitHub JSON based on selected technology and difficulty level
    const getQuestionsFromGithub = (techId, numberOfQuestions) => {
        if (!githubQuestions || !githubQuestions.categories) {
            return null;
        }

        // Map the tech ID to category name
        const categoryName = techToCategoryMap[techId];
        if (!categoryName) {
            return null;
        }

        // Find the matching category
        const category = githubQuestions.categories.find(
            cat => cat.category.toLowerCase() === categoryName.toLowerCase()
        );
        
        if (category && category.questions) {
            // Get questions based on experience level
            let questionsArray = [];
            
            // Map experience level to difficulty key in JSON
            if (userData.experience === 'entry') {
                questionsArray = category.questions.entry || [];
            } else if (userData.experience === 'intermediate') {
                questionsArray = category.questions.intermediate || [];
            } else if (userData.experience === 'senior') {
                questionsArray = category.questions.senior || [];
                // If no senior questions, try expert
                if (questionsArray.length === 0) {
                    questionsArray = category.questions.expert || [];
                }
            } else if (userData.experience === 'expert') {
                questionsArray = category.questions.expert || [];
                // If no expert questions, try senior
                if (questionsArray.length === 0) {
                    questionsArray = category.questions.senior || [];
                }
            }

            // If no questions match the difficulty, use entry as fallback
            if (questionsArray.length === 0) {
                questionsArray = category.questions.entry || [];
                console.log(`⚠️ No ${userData.experience} level questions found for ${techId}, using entry level`);
            }

            // Randomly select the required number of questions
            const shuffled = [...questionsArray].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, numberOfQuestions);
            
            console.log(`✅ Selected ${selected.length} ${userData.experience} level questions for ${techId} (IDs: ${selected.map(q => q.id).join(', ')})`);

            // Format questions to match our internal structure
            return selected.map(q => ({
                question: q.question,
                options: q.options.reduce((acc, opt, idx) => {
                    const letter = String.fromCharCode(65 + idx);
                    acc[letter] = opt;
                    return acc;
                }, {}),
                correct: q.correctAnswer,
                difficulty: userData.experience === 'entry' ? 'beginner' : 
                           userData.experience === 'intermediate' ? 'intermediate' : 'advanced',
                explanation: q.explanation,
                technology: techId,
                id: q.id
            }));
        }

        return null;
    };

    // Generate quiz questions from GitHub JSON only
    const generateTechnologyQuizQuestions = async (techId, numberOfQuestions) => {
        // Get questions from GitHub JSON
        const githubQs = getQuestionsFromGithub(techId, numberOfQuestions);
        if (githubQs && githubQs.length > 0) {
            console.log(`Using ${githubQs.length} questions from GitHub for:`, techId);
            return githubQs;
        }

        // If no GitHub questions available, use fallback
        console.log(`⚠️ No GitHub questions found for ${techId}, using fallback questions`);
        const techName = technologyOptions[userData.targetRole]?.find(t => t.id === techId)?.name || techId;
        
        let difficultyLevel;
        if (userData.experience === 'entry') {
            difficultyLevel = 'beginner';
        } else if (userData.experience === 'intermediate') {
            difficultyLevel = 'intermediate';
        } else {
            difficultyLevel = 'advanced';
        }
        
        return getFallbackQuestions(techName, numberOfQuestions, difficultyLevel, techId);
    };

    const getFallbackQuestions = (techName, numberOfQuestions, difficulty, techId) => {
        const fallbackQuestions = [];
        const difficulties = [difficulty, difficulty, difficulty, difficulty, difficulty];
        
        for (let i = 0; i < numberOfQuestions; i++) {
            fallbackQuestions.push({
                question: `What is your experience level with ${techName}? (Question ${i + 1})`,
                options: {
                    A: "This is dummy data- No experience - I'm just starting to learn",
                    B: "This is dummy data- Basic knowledge - I can handle simple tasks",
                    C: "This is dummy data- Intermediate - I use this regularly in projects",
                    D: "This is dummy data- Advanced - I can mentor others in this skill."
                },
                correct: "D",
                difficulty: difficulties[i % difficulties.length],
                technology: techId,
                id: i + 1
            });
        }
        
        return fallbackQuestions;
    };

    const startQuiz = async () => {
        setIsLoadingQuiz(true);
        
        const selectedTechs = userData.selectedTechnologies;
        const numberOfTechs = selectedTechs.length;
        
        // Determine number of questions per technology
        let questionsPerTech;
        if (numberOfTechs === 1) {
            questionsPerTech = 20; // 20 questions for single technology
        } else {
            questionsPerTech = 10; // 10 questions each for multiple technologies
        }
        
        const totalQuestions = numberOfTechs * questionsPerTech;
        
        // Generate quizzes for each selected technology
        const technologyQuizzes = [];
        
        for (const techId of selectedTechs) {
            const techName = technologyOptions[userData.targetRole]?.find(t => t.id === techId)?.name || techId;
            
            const questions = await generateTechnologyQuizQuestions(techId, questionsPerTech);
            
            technologyQuizzes.push({
                techId,
                techName,
                techIcon: technologyOptions[userData.targetRole]?.find(t => t.id === techId)?.icon || '💻',
                questions,
                score: 0,
                completed: false
            });
        }

        setQuizData({
            technologyQuizzes,
            currentQuizIndex: 0,
            currentQuestionIndex: 0,
            answers: {},
            skillScores: {},
            totalQuestions
        });

        setIsLoadingQuiz(false);
        setStep('quiz');
    };

    const handleQuizAnswer = (answer) => {
        const currentQuiz = quizData.technologyQuizzes[quizData.currentQuizIndex];
        const currentQuestion = currentQuiz.questions[quizData.currentQuestionIndex];
        const isCorrect = answer === currentQuestion.correct;

        // Calculate points based on difficulty
        const points = {
            'beginner': isCorrect ? 1 : 0,
            'intermediate': isCorrect ? 2 : 0,
            'advanced': isCorrect ? 3 : 0
        };

        const questionPoints = points[currentQuestion.difficulty] || 1;

        const answerKey = `${currentQuiz.techId}_q${currentQuestion.id || quizData.currentQuestionIndex}`;
        
        const updatedAnswers = {
            ...quizData.answers,
            [answerKey]: {
                answer,
                correct: currentQuestion.correct,
                isCorrect,
                points: questionPoints,
                techId: currentQuiz.techId,
                questionIndex: quizData.currentQuestionIndex,
                questionId: currentQuestion.id
            }
        };

        // Check if this was the last question for current technology
        if (quizData.currentQuestionIndex === currentQuiz.questions.length - 1) {
            // Calculate score for this technology
            const techAnswers = Object.keys(updatedAnswers)
                .filter(key => key.startsWith(currentQuiz.techId))
                .map(key => updatedAnswers[key]);

            const totalPoints = techAnswers.reduce((sum, a) => sum + a.points, 0);
            const maxPoints = currentQuiz.questions.length * 3; // Max 3 points per question
            const score = Math.min(5, (totalPoints / maxPoints) * 5);

            const updatedSkillScores = {
                ...quizData.skillScores,
                [currentQuiz.techId]: score
            };

            // Mark current quiz as completed
            const updatedQuizzes = [...quizData.technologyQuizzes];
            updatedQuizzes[quizData.currentQuizIndex].completed = true;
            updatedQuizzes[quizData.currentQuizIndex].score = score;

            // Move to next technology or finish
            if (quizData.currentQuizIndex < quizData.technologyQuizzes.length - 1) {
                setQuizData({
                    ...quizData,
                    technologyQuizzes: updatedQuizzes,
                    currentQuizIndex: quizData.currentQuizIndex + 1,
                    currentQuestionIndex: 0,
                    answers: updatedAnswers,
                    skillScores: updatedSkillScores
                });
            } else {
                // Quiz complete
                setQuizData({
                    ...quizData,
                    technologyQuizzes: updatedQuizzes,
                    answers: updatedAnswers,
                    skillScores: updatedSkillScores
                });
                analyzeQuizResults(updatedSkillScores);
                setStep('results');
            }
        } else {
            // Next question in same technology
            setQuizData({
                ...quizData,
                currentQuestionIndex: quizData.currentQuestionIndex + 1,
                answers: updatedAnswers
            });
        }
    };

    const analyzeQuizResults = (skillScores) => {
        const benchmark = benchmarkScores[userData.experience];
        
        let gaps = [];
        let strengths = [];
        
        // Get technology details
        const selectedTechs = userData.selectedTechnologies;
        const techDetails = selectedTechs.map(techId => {
            const tech = technologyOptions[userData.targetRole]?.find(t => t.id === techId);
            return {
                id: techId,
                name: tech?.name || techId,
                icon: tech?.icon || '💻'
            };
        });

        techDetails.forEach(tech => {
            const rating = skillScores[tech.id] || 0;
            
            if (rating < benchmark.min) {
                gaps.push({
                    skill: tech.name,
                    technology: tech.id,
                    icon: tech.icon,
                    current: rating.toFixed(1),
                    target: benchmark.target,
                    gap: (benchmark.target - rating).toFixed(1),
                    priority: rating <= 2 ? 'Critical' : 'Important'
                });
            } else if (rating >= benchmark.target) {
                strengths.push({ 
                    skill: tech.name, 
                    technology: tech.id,
                    icon: tech.icon,
                    rating: rating.toFixed(1) 
                });
            }
        });

        gaps.sort((a, b) => b.gap - a.gap);

        const allScores = Object.values(skillScores);
        const overallAverage = (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(2);

        setResults({
            gaps,
            strengths,
            overallAverage,
            benchmark,
            totalSkills: allScores.length,
            skillScores,
            techDetails
        });
    };

    const getLearningResources = (technology) => {
        // Technology-specific resources
        const techResources = {
            'javascript': [
                { name: 'JavaScript.info', type: 'Tutorial', url: 'https://javascript.info' },
                { name: 'freeCodeCamp JS', type: 'Course', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/' },
                { name: 'MDN Web Docs', type: 'Documentation', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' }
            ],
            'python': [
                { name: 'Python.org Tutorial', type: 'Official', url: 'https://docs.python.org/3/tutorial/' },
                { name: 'Real Python', type: 'Platform', url: 'https://realpython.com' },
                { name: 'Automate the Boring Stuff', type: 'Book', url: 'https://automatetheboringstuff.com' }
            ],
            'java': [
                { name: 'Java Tutorials', type: 'Official', url: 'https://docs.oracle.com/javase/tutorial/' },
                { name: 'Baeldung', type: 'Tutorial', url: 'https://www.baeldung.com' },
                { name: 'Java Code Geeks', type: 'Articles', url: 'https://www.javacodegeeks.com' }
            ],
            'react': [
                { name: 'React Docs', type: 'Official', url: 'https://react.dev' },
                { name: 'Scrimba React Course', type: 'Interactive', url: 'https://scrimba.com/learn/learnreact' },
                { name: 'Epic React', type: 'Course', url: 'https://epicreact.dev' }
            ],
            'nodejs': [
                { name: 'Node.js Docs', type: 'Official', url: 'https://nodejs.org/en/docs/' },
                { name: 'The Odin Project', type: 'Curriculum', url: 'https://www.theodinproject.com' },
                { name: 'Node School', type: 'Interactive', url: 'https://nodeschool.io' }
            ],
            'sql': [
                { name: 'SQL Tutorial', type: 'Tutorial', url: 'https://www.w3schools.com/sql/' },
                { name: 'Mode SQL Tutorial', type: 'Interactive', url: 'https://mode.com/sql-tutorial/' },
                { name: 'SQLZoo', type: 'Practice', url: 'https://sqlzoo.net' }
            ],
            'git': [
                { name: 'Git Documentation', type: 'Official', url: 'https://git-scm.com/doc' },
                { name: 'GitHub Learning Lab', type: 'Interactive', url: 'https://lab.github.com' },
                { name: 'Atlassian Git Tutorial', type: 'Tutorial', url: 'https://www.atlassian.com/git/tutorials' }
            ],
            'aws': [
                { name: 'AWS Training', type: 'Official', url: 'https://aws.amazon.com/training/' },
                { name: 'A Cloud Guru', type: 'Platform', url: 'https://acloudguru.com' },
                { name: 'AWS Certified Solutions', type: 'Course', url: 'https://www.coursera.org/aws-certifications' }
            ],
            'docker': [
                { name: 'Docker Documentation', type: 'Official', url: 'https://docs.docker.com' },
                { name: 'Docker Curriculum', type: 'Tutorial', url: 'https://docker-curriculum.com' },
                { name: 'Play with Docker', type: 'Interactive', url: 'https://labs.play-with-docker.com' }
            ],
            'testing': [
                { name: 'Jest Docs', type: 'Official', url: 'https://jestjs.io/docs/getting-started' },
                { name: 'Testing Library', type: 'Docs', url: 'https://testing-library.com/docs/' },
                { name: 'Cypress Docs', type: 'Official', url: 'https://docs.cypress.io' }
            ]
        };

        // Default resources for any technology
        const defaultResources = [
            { name: 'Coursera', type: 'Platform', url: 'https://www.coursera.org' },
            { name: 'Udemy', type: 'Platform', url: 'https://www.udemy.com' },
            { name: 'YouTube', type: 'Video', url: 'https://www.youtube.com' }
        ];

        // Return tech-specific resources if available, otherwise default
        return techResources[technology] || defaultResources;
    };

    const IntroStep = () => (
        <div className="max-w-3xl mx-auto text-center mt-10">
            <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white p-8 rounded-2xl mb-8 shadow-xl">
                <Brain className="w-16 h-16 mx-auto mb-4" />
                <h1 className="text-4xl font-bold mb-4">Skills Assessment</h1>
                <p className="text-xl">Test your knowledge with adaptive quizzes tailored to your experience level</p>
                
                {loadingGithubData && (
                    <div className="mt-4 bg-white/20 px-4 py-2 rounded-lg inline-block">
                        <p className="text-sm animate-pulse">Loading question bank...</p>
                    </div>
                )}
                
                {githubError && (
                    <div className="mt-4 bg-red-500/30 px-4 py-2 rounded-lg inline-block">
                        <p className="text-sm">⚠️ Using fallback questions (GitHub data unavailable)</p>
                    </div>
                )}
                
                {githubQuestions && !loadingGithubData && (
                    <div className="mt-4 bg-emerald-700/30 px-4 py-2 rounded-lg inline-block">
                        <p className="text-sm">✓ {githubQuestions.categories?.length || 0} technology categories loaded</p>
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-md border-2 border-emerald-100">
                    <Code className="w-12 h-12 text-emerald-700 mx-auto mb-3" />
                    <h3 className="font-bold text-lg mb-2 text-gray-800">Select Technologies</h3>
                    <p className="text-gray-600">Choose one technology for 20 questions, or multiple for 10 questions each</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-2 border-emerald-100">
                    <Zap className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                    <h3 className="font-bold text-lg mb-2 text-gray-800">Experience-Based</h3>
                    <p className="text-gray-600">Questions tailored to your {userData.experience || 'selected'} level</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-2 border-emerald-100">
                    <Target className="w-12 h-12 text-emerald-700 mx-auto mb-3" />
                    <h3 className="font-bold text-lg mb-2 text-gray-800">Detailed Results</h3>
                    <p className="text-gray-600">Get personalized feedback and learning resources</p>
                </div>
            </div>

            <button
                onClick={() => setStep('profile')}
                className="bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 flex items-center gap-2 mx-auto"
            >
                Start Assessment <ArrowRight className="w-5 h-5" />
            </button>
        </div>
    );

    const ProfileStep = () => (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl mt-10">
            <h2 className="text-3xl font-bold mb-6 text-emerald-700">Your Profile</h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                    <input
                        type="text"
                        defaultValue={userData.name}
                        onBlur={(e) => setUserData({ ...userData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        placeholder="John Doe"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Role</label>
                    <input
                        type="text"
                        defaultValue={userData.currentRole}
                        onBlur={(e) => setUserData({ ...userData, currentRole: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-colors"
                        placeholder="e.g., Junior Developer, Student"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Target Role *</label>
                    <select
                        value={userData.targetRole}
                        onChange={(e) => setUserData({ ...userData, targetRole: e.target.value, selectedTechnologies: [] })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                        <option value="">Select a role...</option>
                        {Object.keys(skillCategories).map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Experience Level *</label>
                    <select
                        value={userData.experience}
                        onChange={(e) => setUserData({ ...userData, experience: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    >
                        <option value="">Select level...</option>
                        <option value="entry">Entry Level (0-2 years) - Beginner questions</option>
                        <option value="intermediate">Intermediate (3-5 years) - Intermediate questions</option>
                        <option value="senior">Senior (6-10 years) - Advanced questions</option>
                        <option value="expert">Expert (10+ years) - Advanced questions</option>
                    </select>
                </div>
            </div>

            <div className="flex gap-4 mt-8">
                <button
                    onClick={() => setStep('intro')}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-gray-700"
                >
                    Back
                </button>
                <button
                    onClick={() => {
                        if (userData.targetRole && userData.experience) {
                            setStep('technologies');
                        } else {
                            alert('Please complete all required fields');
                        }
                    }}
                    className="flex-1 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                    Continue
                </button>
            </div>
        </div>
    );

    const TechnologyStep = () => {
        const techs = technologyOptions[userData.targetRole] || [];

        const toggleTechnology = (techId) => {
            const current = userData.selectedTechnologies;
            if (current.includes(techId)) {
                setUserData({
                    ...userData,
                    selectedTechnologies: current.filter(id => id !== techId)
                });
            } else {
                setUserData({
                    ...userData,
                    selectedTechnologies: [...current, techId]
                });
            }
        };

        const getQuestionsCount = () => {
            const count = userData.selectedTechnologies.length;
            if (count === 0) return 0;
            if (count === 1) return 20;
            return count * 10;
        };

        return (
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl mt-10">
                <h2 className="text-3xl font-bold mb-2 text-emerald-700">Select Technologies</h2>
                <p className="text-gray-600 mb-6">
                    Choose technologies to assess. {userData.selectedTechnologies.length === 1 
                        ? '✓ Single technology selected: You will receive 20 questions' 
                        : userData.selectedTechnologies.length > 1 
                        ? `✓ ${userData.selectedTechnologies.length} technologies selected: You will receive 10 questions each (${getQuestionsCount()} total)` 
                        : 'Select one technology for 20 questions, or multiple for 10 questions each'}
                </p>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    {techs.map(tech => (
                        <button
                            key={tech.id}
                            onClick={() => toggleTechnology(tech.id)}
                            className={`p-4 rounded-xl border-2 transition-all text-left hover:scale-[1.02] duration-300 ${userData.selectedTechnologies.includes(tech.id)
                                    ? 'border-emerald-600 bg-emerald-50 shadow-md'
                                    : 'border-gray-300 hover:border-emerald-600 hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-3xl">{tech.icon}</span>
                                <div className="flex-1">
                                    <div className="font-semibold text-gray-800">{tech.name}</div>
                                    {userData.selectedTechnologies.includes(tech.id) && (
                                        <CheckCircle className="w-5 h-5 text-emerald-600 inline" />
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg mb-6">
                    <p className="text-sm text-emerald-700">
                        <strong>Selected: {userData.selectedTechnologies.length} technologies</strong>
                        {userData.selectedTechnologies.length === 0 && " - Please select at least one technology"}
                        {userData.selectedTechnologies.length === 1 && " - You will get 20 questions at your experience level"}
                        {userData.selectedTechnologies.length > 1 && ` - You will get 10 questions per technology (${userData.selectedTechnologies.length * 10} total) at your experience level`}
                    </p>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => setStep('profile')}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-gray-700"
                    >
                        Back
                    </button>
                    <button
                        onClick={startQuiz}
                        disabled={userData.selectedTechnologies.length === 0}
                        className={`flex-1 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-[1.02] ${
                            userData.selectedTechnologies.length === 0
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-white'
                        }`}
                    >
                        Start Quiz Assessment ({getQuestionsCount()} questions)
                    </button>
                </div>
            </div>
        );
    };

    const QuizStep = () => {
        if (isLoadingQuiz) {
            return (
                <div className="max-w-2xl mx-auto bg-white p-12 rounded-2xl shadow-xl text-center mt-10">
                    <Brain className="w-16 h-16 text-emerald-700 mx-auto mb-4 animate-pulse" />
                    <h3 className="text-2xl font-bold mb-2 text-gray-800">Generating Questions...</h3>
                    <p className="text-gray-600">
                        Creating {userData.selectedTechnologies.length === 1 ? '20' : '10'} questions for each technology at your experience level
                    </p>
                    <div className="mt-6 w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-emerald-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                </div>
            );
        }

        if (quizData.technologyQuizzes.length === 0) {
            return null;
        }

        const currentQuiz = quizData.technologyQuizzes[quizData.currentQuizIndex];
        const currentQuestion = currentQuiz.questions[quizData.currentQuestionIndex];
        
        // Calculate progress
        const questionsPerTech = currentQuiz.questions.length;
        const completedTechs = quizData.currentQuizIndex;
        const completedQuestionsInCurrentTech = quizData.currentQuestionIndex;
        const totalCompletedQuestions = (completedTechs * questionsPerTech) + completedQuestionsInCurrentTech;
        const progress = (totalCompletedQuestions / quizData.totalQuestions) * 100;

        return (
            <div className="max-w-3xl mx-auto mt-10">
                {/* Progress Header */}
                <div className="bg-white p-6 rounded-2xl shadow-xl mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <span className="text-3xl">{currentQuiz.techIcon}</span>
                            <div>
                                <h3 className="text-xl font-bold text-emerald-700">{currentQuiz.techName}</h3>
                                <p className="text-sm text-gray-600">
                                    Technology {quizData.currentQuizIndex + 1} of {quizData.technologyQuizzes.length}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-emerald-600">
                                {totalCompletedQuestions + 1}/{quizData.totalQuestions}
                            </div>
                            <p className="text-xs text-gray-600">Questions</p>
                        </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-gradient-to-r from-emerald-700 to-emerald-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>Started</span>
                        <span>In Progress</span>
                        <span>Complete</span>
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-white p-8 rounded-2xl shadow-xl">
                    <div className="flex items-start gap-3 mb-6">
                        <div className="bg-emerald-100 text-emerald-700 w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                            {quizData.currentQuestionIndex + 1}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                                    {currentQuestion.difficulty} • {currentQuiz.techName}
                                </span>
                            </div>
                            <h4 className="text-xl font-semibold text-gray-800 leading-relaxed">
                                {currentQuestion.question}
                            </h4>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {Object.entries(currentQuestion.options).map(([letter, text]) => (
                            <button
                                key={letter}
                                onClick={() => handleQuizAnswer(letter)}
                                className="w-full p-5 border-2 border-gray-300 rounded-xl hover:border-emerald-600 hover:bg-emerald-50 transition-all duration-300 text-left group hover:scale-[1.01]"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="bg-gray-100 group-hover:bg-emerald-600 group-hover:text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold flex-shrink-0 transition-all duration-300">
                                        {letter}
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <p className="text-gray-800">{text}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-600 text-center">
                            Question {quizData.currentQuestionIndex + 1} of {currentQuiz.questions.length} for {currentQuiz.techName}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    const ResultsStep = () => {
        if (!results) return null;

        const chartData = results.techDetails.map(tech => ({
            technology: tech.name,
            'Your Score': parseFloat(results.skillScores[tech.id] || 0),
            'Target Score': results.benchmark.target,
            'Min Required': results.benchmark.min
        }));

        const radarData = results.techDetails.map(tech => ({
            technology: tech.name,
            current: parseFloat(results.skillScores[tech.id] || 0),
            target: results.benchmark.target
        }));

        const criticalGaps = results.gaps.filter(g => g.priority === 'Critical');
        const importantGaps = results.gaps.filter(g => g.priority === 'Important');

        return (
            <div className="max-w-6xl mx-auto mt-10">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white p-8 rounded-2xl mb-8 shadow-xl">
                    <Award className="w-12 h-12 mb-3" />
                    <h2 className="text-4xl font-bold mb-2">Assessment Complete!</h2>
                    <p className="text-xl">Here's your technology skills gap analysis</p>
                    <div className="flex items-center gap-4 mt-4">
                        <p className="text-lg">
                            {userData.selectedTechnologies.length === 1 
                                ? `Assessed: 1 technology with 20 questions` 
                                : `Assessed: ${userData.selectedTechnologies.length} technologies with ${userData.selectedTechnologies.length * 10} questions`}
                        </p>
                        <span className="bg-white/30 px-3 py-1 rounded-full text-sm">
                            {userData.experience} level
                        </span>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-emerald-600">
                        <div className="text-3xl font-bold text-emerald-700">{results.overallAverage}</div>
                        <div className="text-gray-600 font-medium">Overall Score</div>
                        <div className="text-sm text-gray-500 mt-1">Target: {results.benchmark.target}</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
                        <div className="text-3xl font-bold text-red-600">{results.gaps.length}</div>
                        <div className="text-gray-600 font-medium">Skill Gaps</div>
                        <div className="text-sm text-gray-500 mt-1">{criticalGaps.length} critical</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-emerald-500">
                        <div className="text-3xl font-bold text-emerald-600">{results.strengths.length}</div>
                        <div className="text-gray-600 font-medium">Strengths</div>
                        <div className="text-sm text-gray-500 mt-1">Above target</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-emerald-700">
                        <div className="text-3xl font-bold text-emerald-700">
                            {((results.totalSkills - results.gaps.length) / results.totalSkills * 100).toFixed(0)}%
                        </div>
                        <div className="text-gray-600 font-medium">Ready for Role</div>
                        <div className="text-sm text-gray-500 mt-1">Skills at target</div>
                    </div>
                </div>

                {/* Visualizations */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Technology Scores</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="technology" angle={-45} textAnchor="end" height={100} />
                                <YAxis domain={[0, 5]} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Your Score" fill="#047857" />
                                <Bar dataKey="Target Score" fill="#10b981" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Skills Balance</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <RadarChart data={radarData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="technology" />
                                <PolarRadiusAxis domain={[0, 5]} />
                                <Radar name="Current" dataKey="current" stroke="#047857" fill="#047857" fillOpacity={0.6} />
                                <Radar name="Target" dataKey="target" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                                <Legend />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Critical Gaps */}
                {criticalGaps.length > 0 && (
                    <div className="bg-white p-8 rounded-xl shadow-md mb-8 border-l-4 border-red-500">
                        <h3 className="text-2xl font-bold mb-4 text-red-600 flex items-center gap-2">
                            <AlertCircle className="w-6 h-6" /> Critical Skill Gaps (Priority)
                        </h3>
                        <div className="space-y-6">
                            {criticalGaps.map((gap, idx) => (
                                <div key={idx} className="bg-red-50 p-6 rounded-lg">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">{gap.icon}</span>
                                            <div>
                                                <h4 className="font-bold text-lg text-gray-800">{gap.skill}</h4>
                                                <p className="text-sm text-gray-600">Technology</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-red-600">{gap.current}/5</div>
                                            <div className="text-sm text-gray-600">Target: {gap.target}</div>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className="bg-red-500 h-3 rounded-full transition-all"
                                                style={{ width: `${(parseFloat(gap.current) / 5) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="font-semibold mb-2 flex items-center gap-2 text-gray-700">
                                            <BookOpen className="w-4 h-4" /> Recommended Resources:
                                        </p>
                                        <div className="grid gap-2">
                                            {getLearningResources(gap.technology).map((resource, ridx) => (
                                                <a
                                                    key={ridx}
                                                    href={resource.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 bg-white p-3 rounded-lg hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-emerald-600"
                                                >
                                                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                                                    <span className="flex-1 font-medium text-gray-800">{resource.name}</span>
                                                    <span className="text-sm bg-emerald-100 text-emerald-700 px-2 py-1 rounded">{resource.type}</span>
                                                    <ChevronRight className="w-4 h-4 text-gray-400" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Important Gaps */}
                {importantGaps.length > 0 && (
                    <div className="bg-white p-8 rounded-xl shadow-md mb-8 border-l-4 border-emerald-600">
                        <h3 className="text-2xl font-bold mb-4 text-emerald-700">Areas for Improvement</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {importantGaps.map((gap, idx) => (
                                <div key={idx} className="bg-emerald-50 p-4 rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2 flex-1">
                                            <span className="text-xl">{gap.icon}</span>
                                            <div>
                                                <h4 className="font-bold text-gray-800">{gap.skill}</h4>
                                                <p className="text-sm text-gray-600">Technology</p>
                                            </div>
                                        </div>
                                        <div className="text-xl font-bold text-emerald-700">{gap.current}/5</div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-emerald-600 h-2 rounded-full"
                                            style={{ width: `${(parseFloat(gap.current) / 5) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Strengths */}
                {results.strengths.length > 0 && (
                    <div className="bg-white p-8 rounded-xl shadow-md mb-8 border-l-4 border-emerald-600">
                        <h3 className="text-2xl font-bold mb-4 text-emerald-700 flex items-center gap-2">
                            <Award className="w-6 h-6" /> Your Strengths
                        </h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            {results.strengths.map((strength, idx) => (
                                <div key={idx} className="bg-emerald-50 p-4 rounded-lg text-center">
                                    <span className="text-3xl mb-2 block">{strength.icon}</span>
                                    <div className="text-2xl font-bold text-emerald-700 mb-1">{strength.rating}/5</div>
                                    <div className="font-semibold text-gray-800">{strength.skill}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Learning Roadmap */}
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 p-8 rounded-xl shadow-md mb-8">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-emerald-700">
                        <Target className="w-6 h-6" /> Your Learning Roadmap
                    </h3>

                    <div className="space-y-4">
                        {criticalGaps.length > 0 && (
                            <div className="bg-white p-6 rounded-lg shadow">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="bg-emerald-700 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">1</div>
                                    <h4 className="text-xl font-bold text-gray-800">Immediate Focus (Next 1-2 months)</h4>
                                </div>
                                <ul className="list-disc list-inside space-y-1 text-gray-700">
                                    {criticalGaps.slice(0, 3).map((gap, idx) => (
                                        <li key={idx}><span className="font-semibold">{gap.skill}</span> - Dedicate 5-10 hours/week</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {importantGaps.length > 0 && (
                            <div className="bg-white p-6 rounded-lg shadow">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">2</div>
                                    <h4 className="text-xl font-bold text-gray-800">Short-term Goals (3-4 months)</h4>
                                </div>
                                <ul className="list-disc list-inside space-y-1 text-gray-700">
                                    {importantGaps.slice(0, 4).map((gap, idx) => (
                                        <li key={idx}><span className="font-semibold">{gap.skill}</span> - Practice 3-5 hours/week</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="bg-emerald-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">3</div>
                                <h4 className="text-xl font-bold text-gray-800">Long-term Development (5-6 months)</h4>
                            </div>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                <li>Build portfolio projects using your strongest technologies</li>
                                <li>Contribute to open-source projects in your focus areas</li>
                                <li>Get certified in your target technologies</li>
                                <li>Network with professionals specializing in these technologies</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={() => {
                            setStep('intro');
                            setQuizData({
                                technologyQuizzes: [],
                                currentQuizIndex: 0,
                                currentQuestionIndex: 0,
                                answers: {},
                                skillScores: {},
                                totalQuestions: 0
                            });
                            setResults(null);
                        }}
                        className="flex-1 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                    >
                        Start New Assessment
                    </button>
                    <button
                        onClick={() => {
                            const resultsData = {
                                user: userData,
                                scores: results.skillScores,
                                gaps: results.gaps,
                                strengths: results.strengths,
                                date: new Date().toLocaleDateString()
                            };
                            const dataStr = JSON.stringify(resultsData, null, 2);
                            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                            const exportFileDefaultName = `skill-gap-assessment-${userData.name || 'user'}-${new Date().toISOString().split('T')[0]}.json`;
                            const linkElement = document.createElement('a');
                            linkElement.setAttribute('href', dataUri);
                            linkElement.setAttribute('download', exportFileDefaultName);
                            linkElement.click();
                        }}
                        className="flex-1 border-2 border-emerald-600 text-emerald-700 px-6 py-4 rounded-xl font-semibold hover:bg-emerald-50 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.02]"
                    >
                        <Download className="w-5 h-5" /> Save Report
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 mt-10">
            <div className="container mx-auto py-8">
                {step === 'intro' && <IntroStep />}
                {step === 'profile' && <ProfileStep />}
                {step === 'technologies' && <TechnologyStep />}
                {step === 'quiz' && <QuizStep />}
                {step === 'results' && <ResultsStep />}
            </div>
        </div>
    );
};

export default SkillGapDiagnosisTool;
