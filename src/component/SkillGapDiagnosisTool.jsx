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
        currentCategory: '',
        currentSkill: '',
        questions: [],
        currentQuestionIndex: 0,
        answers: {},
        skillScores: {}
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
        'testing': 'Testing/QA'
    };

    // Get questions from GitHub JSON based on selected technologies
    const getQuestionsFromGithub = (skill, technologies) => {
        if (!githubQuestions || !githubQuestions.categories) {
            return null;
        }

        // Try to find matching category based on selected technologies
        for (const techId of technologies) {
            const categoryName = techToCategoryMap[techId];
            if (categoryName) {
                const category = githubQuestions.categories.find(
                    cat => cat.category.toLowerCase() === categoryName.toLowerCase()
                );
                
                if (category && category.questions) {
                    // Format questions to match our internal structure
                    return category.questions.slice(0, 5).map(q => ({
                        question: q.question,
                        options: q.options.reduce((acc, opt, idx) => {
                            const letter = String.fromCharCode(65 + idx); // A, B, C, D
                            acc[letter] = opt;
                            return acc;
                        }, {}),
                        correct: q.correctAnswer,
                        difficulty: q.difficulty,
                        explanation: q.explanation
                    }));
                }
            }
        }

        return null;
    };

    // Generate quiz questions using Claude API with GitHub fallback
    const generateQuizQuestions = async (skill, technologies) => {
        // First, try to get questions from GitHub JSON
        const githubQs = getQuestionsFromGithub(skill, technologies);
        if (githubQs && githubQs.length > 0) {
            console.log('Using questions from GitHub for:', skill);
            return githubQs;
        }

        // If GitHub questions not available, use Claude API
        const techContext = technologies.length > 0
            ? `Focus on these technologies: ${technologies.join(', ')}.`
            : '';

        const prompt = `Generate 5 multiple-choice quiz questions to assess proficiency in "${skill}" for a ${userData.targetRole}. ${techContext}

For each question, provide:
1. A practical, scenario-based question
2. Four answer options (A, B, C, D)
3. The correct answer (letter only)
4. A difficulty level (beginner, intermediate, advanced)

Make questions realistic and job-relevant. Mix difficulty levels: 2 beginner, 2 intermediate, 1 advanced.

Respond ONLY with valid JSON in this exact format:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": {
        "A": "First option",
        "B": "Second option", 
        "C": "Third option",
        "D": "Fourth option"
      },
      "correct": "A",
      "difficulty": "beginner"
    }
  ]
}`;

        try {
            const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "claude-sonnet-4-20250514",
                    max_tokens: 1000,
                    messages: [
                        { role: "user", content: prompt }
                    ],
                })
            });

            const data = await response.json();
            const textContent = data.content.find(c => c.type === "text")?.text || "";

            // Clean up the response and parse JSON
            const jsonMatch = textContent.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return (parsed.questions || []).slice(0, 5);
            }

            // Fallback questions if API fails
            return getFallbackQuestions(skill);
        } catch (error) {
            console.error("Error generating quiz:", error);
            return getFallbackQuestions(skill);
        }
    };

    const getFallbackQuestions = (skill) => {
        // Fallback questions in case both GitHub and API fail
        return [
            {
                question: `What is your experience level with ${skill}?`,
                options: {
                    A: "No experience - I'm just starting to learn",
                    B: "Basic knowledge - I can handle simple tasks",
                    C: "Intermediate - I use this regularly in projects",
                    D: "Advanced - I can mentor others in this skill"
                },
                correct: "D",
                difficulty: "beginner"
            },
            {
                question: `How would you rate your practical application of ${skill}?`,
                options: {
                    A: "I've only studied theory, no practical experience",
                    B: "I've done a few tutorials or small projects",
                    C: "I've completed multiple real projects",
                    D: "I've led projects and made architectural decisions"
                },
                correct: "D",
                difficulty: "intermediate"
            },
            {
                question: `In a professional setting, how comfortable are you with ${skill}?`,
                options: {
                    A: "I would need significant guidance and support",
                    B: "I can handle basic tasks with some assistance",
                    C: "I can work independently on most tasks",
                    D: "I can handle complex challenges and train others"
                },
                correct: "D",
                difficulty: "intermediate"
            },
            {
                question: `How do you stay updated with ${skill}?`,
                options: {
                    A: "I haven't started learning about it yet",
                    B: "I occasionally read articles or watch videos",
                    C: "I regularly follow courses and practice",
                    D: "I contribute to community, attend conferences, read docs"
                },
                correct: "D",
                difficulty: "beginner"
            },
            {
                question: `What best describes your problem-solving ability with ${skill}?`,
                options: {
                    A: "I struggle with basic concepts and need help often",
                    B: "I can solve simple problems with references",
                    C: "I can debug and solve most common issues",
                    D: "I can optimize, architect, and solve complex problems"
                },
                correct: "D",
                difficulty: "advanced"
            }
        ];
    };

    const startQuiz = async () => {
        setIsLoadingQuiz(true);
        const skills = skillCategories[userData.targetRole];
        const allSkills = [...skills['Technical Skills'], ...skills['Soft Skills']];

        // Start with first skill
        const firstSkill = allSkills[0];
        const firstCategory = skills['Technical Skills'].includes(firstSkill) ? 'Technical Skills' : 'Soft Skills';

        const questions = await generateQuizQuestions(firstSkill, userData.selectedTechnologies);

        setQuizData({
            currentCategory: firstCategory,
            currentSkill: firstSkill,
            questions,
            currentQuestionIndex: 0,
            answers: {},
            skillScores: {}
        });

        setIsLoadingQuiz(false);
        setStep('quiz');
    };

    const handleQuizAnswer = async (answer) => {
        const currentQuestion = quizData.questions[quizData.currentQuestionIndex];
        const isCorrect = answer === currentQuestion.correct;

        // Calculate points based on difficulty
        const points = {
            'beginner': isCorrect ? 1 : 0,
            'intermediate': isCorrect ? 2 : 0,
            'advanced': isCorrect ? 3 : 0
        };

        const questionPoints = points[currentQuestion.difficulty] || 1;

        const updatedAnswers = {
            ...quizData.answers,
            [`${quizData.currentSkill}_${quizData.currentQuestionIndex}`]: {
                answer,
                correct: currentQuestion.correct,
                isCorrect,
                points: questionPoints
            }
        };

        // Check if this was the last question for current skill
        if (quizData.currentQuestionIndex === quizData.questions.length - 1) {
            // Calculate score for this skill
            const skillAnswers = Object.keys(updatedAnswers)
                .filter(key => key.startsWith(quizData.currentSkill))
                .map(key => updatedAnswers[key]);

            const totalPoints = skillAnswers.reduce((sum, a) => sum + a.points, 0);
            const maxPoints = 10; // 2*1 + 2*2 + 1*3 = 9, rounded to 10
            const score = Math.min(5, (totalPoints / maxPoints) * 5);

            const updatedSkillScores = {
                ...quizData.skillScores,
                [quizData.currentSkill]: score
            };

            // Move to next skill
            const skills = skillCategories[userData.targetRole];
            const allSkills = [...skills['Technical Skills'], ...skills['Soft Skills']];
            const currentSkillIndex = allSkills.indexOf(quizData.currentSkill);

            if (currentSkillIndex < allSkills.length - 1) {
                // Load next skill
                const nextSkill = allSkills[currentSkillIndex + 1];
                const nextCategory = skills['Technical Skills'].includes(nextSkill) ? 'Technical Skills' : 'Soft Skills';

                setIsLoadingQuiz(true);

                const nextQuestions = await generateQuizQuestions(nextSkill, userData.selectedTechnologies);

                setQuizData({
                    currentCategory: nextCategory,
                    currentSkill: nextSkill,
                    questions: nextQuestions,
                    currentQuestionIndex: 0,
                    answers: updatedAnswers,
                    skillScores: updatedSkillScores
                });
                setIsLoadingQuiz(false);
            } else {
                // Quiz complete
                setQuizData({
                    ...quizData,
                    answers: updatedAnswers,
                    skillScores: updatedSkillScores
                });
                analyzeQuizResults(updatedSkillScores);
                setStep('results');
            }
        } else {
            // Next question in same skill
            setQuizData({
                ...quizData,
                currentQuestionIndex: quizData.currentQuestionIndex + 1,
                answers: updatedAnswers
            });
        }
    };

    const analyzeQuizResults = (skillScores) => {
        const skills = skillCategories[userData.targetRole];
        const benchmark = benchmarkScores[userData.experience];

        let gaps = [];
        let strengths = [];
        let categoryScores = {};

        Object.entries(skills).forEach(([category, skillList]) => {
            let categoryTotal = 0;
            let categoryGaps = [];

            skillList.forEach(skill => {
                const rating = skillScores[skill] || 0;
                categoryTotal += rating;

                if (rating < benchmark.min) {
                    gaps.push({
                        skill,
                        category,
                        current: rating.toFixed(1),
                        target: benchmark.target,
                        gap: (benchmark.target - rating).toFixed(1),
                        priority: rating <= 2 ? 'Critical' : 'Important'
                    });
                    categoryGaps.push(skill);
                } else if (rating >= benchmark.target) {
                    strengths.push({ skill, category, rating: rating.toFixed(1) });
                }
            });

            categoryScores[category] = {
                average: (categoryTotal / skillList.length).toFixed(2),
                gaps: categoryGaps.length,
                total: skillList.length
            };
        });

        gaps.sort((a, b) => b.gap - a.gap);

        const allScores = Object.values(skillScores);
        const overallAverage = (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(2);

        setResults({
            gaps,
            strengths,
            categoryScores,
            overallAverage,
            benchmark,
            totalSkills: allScores.length,
            skillScores
        });
    };

    const getLearningResources = (skill, technologies) => {
        // Technology-specific resources
        const techResources = {
            'javascript': [
                { name: 'JavaScript.info', type: 'Tutorial', url: 'https://javascript.info' },
                { name: 'freeCodeCamp JS', type: 'Course', url: 'https://www.freecodecamp.org' }
            ],
            'python': [
                { name: 'Python.org Tutorial', type: 'Official', url: 'https://docs.python.org/3/tutorial' },
                { name: 'Real Python', type: 'Platform', url: 'https://realpython.com' }
            ],
            'react': [
                { name: 'React Docs', type: 'Official', url: 'https://react.dev' },
                { name: 'Scrimba React Course', type: 'Interactive', url: 'https://scrimba.com' }
            ],
            'aws': [
                { name: 'AWS Training', type: 'Official', url: 'https://aws.amazon.com/training' },
                { name: 'A Cloud Guru', type: 'Platform', url: 'https://acloudguru.com' }
            ],
            'figma': [
                { name: 'Figma Tutorial', type: 'Official', url: 'https://www.figma.com/resources/learn-design' },
                { name: 'Designlab', type: 'Course', url: 'https://designlab.com' }
            ]
        };

        // General skill resources
        const skillResources = {
            'Programming Fundamentals': [
                { name: 'CS50', type: 'Course', url: 'https://cs50.harvard.edu' },
                { name: 'The Odin Project', type: 'Curriculum', url: 'https://www.theodinproject.com' }
            ],
            'Data Structures & Algorithms': [
                { name: 'LeetCode', type: 'Practice', url: 'https://leetcode.com' },
                { name: 'AlgoExpert', type: 'Course', url: 'https://www.algoexpert.io' }
            ],
            'Machine Learning': [
                { name: 'Andrew Ng ML Course', type: 'Course', url: 'https://www.coursera.org/learn/machine-learning' },
                { name: 'Fast.ai', type: 'Practical', url: 'https://www.fast.ai' }
            ],
            'default': [
                { name: 'Coursera', type: 'Platform', url: 'https://www.coursera.org' },
                { name: 'Udemy', type: 'Platform', url: 'https://www.udemy.com' },
                { name: 'YouTube', type: 'Video', url: 'https://www.youtube.com' }
            ]
        };

        // Get tech-specific resources if available
        const techSpecific = technologies
            .map(tech => techResources[tech])
            .filter(Boolean)
            .flat()
            .slice(0, 2);

        // Get skill-specific resources
        const skillSpecific = skillResources[skill] || skillResources['default'];

        // Combine and deduplicate
        const combined = [...techSpecific, ...skillSpecific];
        return combined.slice(0, 3);
    };

    const IntroStep = () => (
        <div className="max-w-3xl mx-auto text-center mt-10">
            <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white p-8 rounded-2xl mb-8 shadow-xl">
                <Brain className="w-16 h-16 mx-auto mb-4" />
                <h1 className="text-4xl font-bold mb-4">AI-Powered Skill Gap Assessment</h1>
                <p className="text-xl">Take adaptive quizzes to identify your skill gaps and get personalized learning paths</p>
                
                {loadingGithubData && (
                    <div className="mt-4 bg-white/20 px-4 py-2 rounded-lg inline-block">
                        <p className="text-sm">Loading question bank...</p>
                    </div>
                )}
                
                {githubError && (
                    <div className="mt-4 bg-red-500/30 px-4 py-2 rounded-lg inline-block">
                        <p className="text-sm">⚠️ Using fallback questions (GitHub data unavailable)</p>
                    </div>
                )}
                
                {githubQuestions && !loadingGithubData && (
                    <div className="mt-4 bg-emerald-700/30 px-4 py-2 rounded-lg inline-block">
                        <p className="text-sm">✓ Question bank loaded successfully</p>
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-md border-2 border-emerald-100">
                    <Code className="w-12 h-12 text-emerald-700 mx-auto mb-3" />
                    <h3 className="font-bold text-lg mb-2 text-gray-800">Choose Technologies</h3>
                    <p className="text-gray-600">Select the tech stack you want to assess</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-2 border-emerald-100">
                    <Zap className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                    <h3 className="font-bold text-lg mb-2 text-gray-800">AI-Generated Quizzes</h3>
                    <p className="text-gray-600">Take adaptive questions for each skill</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-2 border-emerald-100">
                    <Target className="w-12 h-12 text-emerald-700 mx-auto mb-3" />
                    <h3 className="font-bold text-lg mb-2 text-gray-800">Personalized Results</h3>
                    <p className="text-gray-600">Get detailed insights and learning roadmap</p>
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
                        <option value="entry">Entry Level (0-2 years)</option>
                        <option value="intermediate">Intermediate (3-5 years)</option>
                        <option value="senior">Senior (6-10 years)</option>
                        <option value="expert">Expert (10+ years)</option>
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

        return (
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl mt-10">
                <h2 className="text-3xl font-bold mb-2 text-emerald-700">Select Technologies</h2>
                <p className="text-gray-600 mb-6">Choose the technologies you want to focus on (optional - select all relevant ones)</p>

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
                        {userData.selectedTechnologies.length === 0 && " - You can skip this or select technologies for more focused questions"}
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
                        className="flex-1 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                    >
                        Start Quiz Assessment
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
                    <h3 className="text-2xl font-bold mb-2 text-gray-800">Generating AI Questions...</h3>
                    <p className="text-gray-600">Creating personalized quiz for {quizData.currentSkill}</p>
                    <div className="mt-6 w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-emerald-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                </div>
            );
        }

        const currentQuestion = quizData.questions[quizData.currentQuestionIndex];
        const skills = skillCategories[userData.targetRole];
        const allSkills = [...skills['Technical Skills'], ...skills['Soft Skills']];
        const currentSkillIndex = allSkills.indexOf(quizData.currentSkill);
        const totalQuestions = allSkills.length * 5;
        const currentQuestionNumber = currentSkillIndex * 5 + quizData.currentQuestionIndex + 1;
        const progress = (currentQuestionNumber / totalQuestions) * 100;

        return (
            <div className="max-w-3xl mx-auto mt-10">
                {/* Progress Header */}
                <div className="bg-white p-6 rounded-2xl shadow-xl mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <div>
                            <h3 className="text-xl font-bold text-emerald-700">{quizData.currentSkill}</h3>
                            <p className="text-sm text-gray-600">{quizData.currentCategory}</p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-emerald-600">
                                {currentQuestionNumber}/{totalQuestions}
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
                                    {currentQuestion.difficulty}
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
                            Skill {currentSkillIndex + 1} of {allSkills.length} • Question {quizData.currentQuestionIndex + 1} of 5
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    const ResultsStep = () => {
        if (!results) return null;

        const chartData = Object.entries(results.categoryScores).map(([category, data]) => ({
            category: category.replace(' Skills', ''),
            'Your Score': parseFloat(data.average),
            'Target Score': results.benchmark.target,
            'Min Required': results.benchmark.min
        }));

        const radarData = Object.entries(results.categoryScores).map(([category, data]) => ({
            category: category.replace(' Skills', ''),
            current: parseFloat(data.average),
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
                    <p className="text-xl">Here's your personalized skill gap analysis</p>
                    <p className="text-lg mt-2">Target Role: {userData.targetRole} ({userData.experience} level)</p>
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
                        <div className="text-gray-600 font-medium">Role Ready</div>
                        <div className="text-sm text-gray-500 mt-1">Skills at target</div>
                    </div>
                </div>

                {/* Visualizations */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Category Performance</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="category" angle={-45} textAnchor="end" height={100} />
                                <YAxis domain={[0, 5]} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Your Score" fill="#047857" /> {/* emerald-700 */}
                                <Bar dataKey="Target Score" fill="#10b981" /> {/* emerald-500 */}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-xl font-bold mb-4 text-gray-800">Skill Balance</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <RadarChart data={radarData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="category" />
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
                                        <div>
                                            <h4 className="font-bold text-lg text-gray-800">{gap.skill}</h4>
                                            <p className="text-sm text-gray-600">{gap.category}</p>
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
                                            {getLearningResources(gap.skill, userData.selectedTechnologies).map((resource, ridx) => (
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
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-800">{gap.skill}</h4>
                                            <p className="text-sm text-gray-600">{gap.category}</p>
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
                                    <div className="text-2xl font-bold text-emerald-700 mb-1">{strength.rating}/5</div>
                                    <div className="font-semibold text-gray-800">{strength.skill}</div>
                                    <div className="text-sm text-gray-600">{strength.category}</div>
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
                                <li>Build portfolio projects demonstrating your skills</li>
                                <li>Contribute to open-source projects</li>
                                <li>Network with professionals in your field</li>
                                <li>Consider certification if relevant to your role</li>
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
                                currentCategory: '',
                                currentSkill: '',
                                questions: [],
                                currentQuestionIndex: 0,
                                answers: {},
                                skillScores: {}
                            });
                            setResults(null);
                        }}
                        className="flex-1 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                    >
                        Start New Assessment
                    </button>
                    <button
                        onClick={() => window.print()}
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