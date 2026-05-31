import React, { useState, useEffect } from "react";
import { Users, Code, Star, Clock, Award, TrendingUp, Search, Filter, Plus, Calendar, GitBranch, Database, Server, Cloud, Smartphone, Shield, Zap, Cpu, HardDrive, Network, Globe, Wrench, Palette, Layout, BarChart3, RefreshCw, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";

function Developer() {
  const [developers, setDevelopers] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDeveloperModal, setShowAddDeveloperModal] = useState(false);
  const [viewMode, setViewMode] = useState('heatmap'); // 'heatmap', 'cards', 'matrix'

  const [newDeveloper, setNewDeveloper] = useState({
    name: '',
    email: '',
    role: 'developer',
    department: 'engineering',
    startDate: '',
    skills: {},
    availability: 'full-time',
    utilization: 0
  });

  useEffect(() => {
    fetchDevelopers();
    fetchSkills();
  }, []);

  const fetchDevelopers = () => {
    // Demo developers data with skill levels
    const demoDevelopers = [
      { 
        id: 1, 
        name: 'Alex Thompson', 
        email: 'alex@company.com',
        role: 'Senior Developer',
        department: 'Engineering',
        startDate: '2021-03-15',
        availability: 'full-time',
        utilization: 85,
        skills: {
          'javascript': 95,
          'react': 92,
          'nodejs': 88,
          'python': 75,
          'database': 80,
          'api': 90,
          'testing': 85,
          'devops': 70
        },
        projects: 4,
        completedTasks: 156,
        experience: '5+ years'
      },
      { 
        id: 2, 
        name: 'Sarah Chen', 
        email: 'sarah@company.com',
        role: 'Frontend Developer',
        department: 'Engineering',
        startDate: '2022-01-10',
        availability: 'full-time',
        utilization: 78,
        skills: {
          'javascript': 88,
          'react': 95,
          'css': 92,
          'typescript': 85,
          'design': 80,
          'ux': 75,
          'testing': 82,
          'performance': 85
        },
        projects: 3,
        completedTasks: 124,
        experience: '3+ years'
      },
      { 
        id: 3, 
        name: 'Marcus Johnson', 
        email: 'marcus@company.com',
        role: 'Backend Developer',
        department: 'Engineering',
        startDate: '2020-08-20',
        availability: 'full-time',
        utilization: 92,
        skills: {
          'python': 95,
          'django': 90,
          'database': 92,
          'api': 88,
          'docker': 85,
          'kubernetes': 80,
          'security': 75,
          'performance': 88
        },
        projects: 5,
        completedTasks: 203,
        experience: '6+ years'
      },
      { 
        id: 4, 
        name: 'Emily Rodriguez', 
        email: 'emily@company.com',
        role: 'Full Stack Developer',
        department: 'Engineering',
        startDate: '2021-11-05',
        availability: 'full-time',
        utilization: 80,
        skills: {
          'javascript': 85,
          'react': 82,
          'nodejs': 80,
          'python': 75,
          'database': 78,
          'devops': 72,
          'testing': 80,
          'api': 85
        },
        projects: 4,
        completedTasks: 145,
        experience: '4+ years'
      },
      { 
        id: 5, 
        name: 'David Kim', 
        email: 'david@company.com',
        role: 'DevOps Engineer',
        department: 'Infrastructure',
        startDate: '2019-06-12',
        availability: 'full-time',
        utilization: 88,
        skills: {
          'docker': 95,
          'kubernetes': 92,
          'aws': 90,
          'devops': 95,
          'ci_cd': 92,
          'security': 85,
          'monitoring': 88,
          'networking': 82
        },
        projects: 6,
        completedTasks: 178,
        experience: '7+ years'
      },
      { 
        id: 6, 
        name: 'Lisa Patel', 
        email: 'lisa@company.com',
        role: 'QA Engineer',
        department: 'Quality Assurance',
        startDate: '2022-04-18',
        availability: 'full-time',
        utilization: 75,
        skills: {
          'testing': 95,
          'automation': 90,
          'javascript': 70,
          'python': 75,
          'api': 82,
          'performance': 78,
          'security': 72,
          'mobile': 65
        },
        projects: 3,
        completedTasks: 98,
        experience: '2+ years'
      }
    ];

    setDevelopers(demoDevelopers);
  };

  const fetchSkills = () => {
    const allSkills = [
      { id: 'javascript', name: 'JavaScript', category: 'Frontend', icon: Code },
      { id: 'react', name: 'React', category: 'Frontend', icon: Layout },
      { id: 'css', name: 'CSS', category: 'Frontend', icon: Palette },
      { id: 'typescript', name: 'TypeScript', category: 'Frontend', icon: Code },
      { id: 'nodejs', name: 'Node.js', category: 'Backend', icon: Server },
      { id: 'python', name: 'Python', category: 'Backend', icon: Cpu },
      { id: 'django', name: 'Django', category: 'Backend', icon: Server },
      { id: 'database', name: 'Database', category: 'Backend', icon: Database },
      { id: 'api', name: 'API', category: 'Backend', icon: Globe },
      { id: 'docker', name: 'Docker', category: 'DevOps', icon: Cloud },
      { id: 'kubernetes', name: 'Kubernetes', category: 'DevOps', icon: Server },
      { id: 'aws', name: 'AWS', category: 'DevOps', icon: Cloud },
      { id: 'devops', name: 'DevOps', category: 'DevOps', icon: Wrench },
      { id: 'ci_cd', name: 'CI/CD', category: 'DevOps', icon: GitBranch },
      { id: 'testing', name: 'Testing', category: 'QA', icon: Shield },
      { id: 'automation', name: 'Automation', category: 'QA', icon: Zap },
      { id: 'security', name: 'Security', category: 'Security', icon: Shield },
      { id: 'performance', name: 'Performance', category: 'Performance', icon: TrendingUp },
      { id: 'design', name: 'Design', category: 'Design', icon: Palette },
      { id: 'ux', name: 'UX', category: 'Design', icon: Layout },
      { id: 'networking', name: 'Networking', category: 'Infrastructure', icon: Network },
      { id: 'monitoring', name: 'Monitoring', category: 'Infrastructure', icon: BarChart3 },
      { id: 'mobile', name: 'Mobile', category: 'Mobile', icon: Smartphone }
    ];

    setSkills(allSkills);
  };

  const getSkillColor = (level) => {
    if (level >= 90) return 'bg-green-500';
    if (level >= 70) return 'bg-blue-500';
    if (level >= 50) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const getSkillLevelColor = (level) => {
    if (level >= 90) return 'text-green-600 bg-green-50';
    if (level >= 70) return 'text-blue-600 bg-blue-50';
    if (level >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  const SkillHeatmapCell = ({ skill, level }) => (
    <div
      className={`p-3 rounded-lg transition-all hover:scale-105 cursor-pointer ${getSkillColor(level)} text-white relative group`}
    >
      <div className="text-xs font-semibold truncate">{skill.name}</div>
      <div className="text-xl font-bold">{level}%</div>
      <div className="absolute inset-0 bg-black bg-opacity-75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
        <span className="text-white text-xs">{skill.category}</span>
      </div>
    </div>
  );

  const DeveloperSkillMatrix = ({ developer }) => {
    const skillEntries = Object.entries(developer.skills);
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">{developer.name}</h3>
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${developer.utilization > 85 ? 'bg-red-100 text-red-700' : developer.utilization > 70 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
              {developer.utilization}% utilized
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>{developer.role}</span>
            <span>{developer.experience}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full ${developer.utilization > 85 ? 'bg-red-500' : developer.utilization > 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
              style={{ width: `${developer.utilization}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {skillEntries.map(([skillId, level]) => {
            const skill = skills.find(s => s.id === skillId);
            return skill ? <SkillHeatmapCell key={skillId} skill={skill} level={level} /> : null;
          })}
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {developer.startDate}</span>
            <span className="flex items-center gap-1"><Award className="h-4 w-4" /> {developer.completedTasks} tasks</span>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Edit className="h-4 w-4 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Eye className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const SkillsHeatmapView = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {developers.map(developer => (
          <DeveloperSkillMatrix key={developer.id} developer={developer} />
        ))}
      </div>
    );
  };

  const DeveloperCard = ({ developer }) => {
    const topSkills = Object.entries(developer.skills)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
    
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
              {developer.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{developer.name}</h3>
              <p className="text-sm text-gray-600">{developer.role}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${developer.utilization > 85 ? 'bg-red-100 text-red-700' : developer.utilization > 70 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
            {developer.utilization}% utilized
          </div>
        </div>

        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className={`h-2 rounded-full ${developer.utilization > 85 ? 'bg-red-500' : developer.utilization > 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
              style={{ width: `${developer.utilization}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{developer.department}</span>
            <span>{developer.experience}</span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="text-xs font-semibold text-gray-500 mb-2">TOP SKILLS</div>
          {topSkills.map(([skillId, level]) => {
            const skill = skills.find(s => s.id === skillId);
            return skill ? (
              <div key={skillId} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{skill.name}</span>
                    <span className="text-gray-500">{level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div className={`h-1 rounded-full ${getSkillColor(level)}`} style={{ width: `${level}%` }} />
                  </div>
                </div>
              </div>
            ) : null;
          })}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Award className="h-4 w-4" /> {developer.projects} projects</span>
            <span className="flex items-center gap-1"><Star className="h-4 w-4" /> {developer.completedTasks} tasks</span>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <Edit className="h-4 w-4 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-red-100">
              <Trash2 className="h-4 w-4 text-red-600" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const SkillsMatrixView = () => {
    const allSkillIds = [...new Set(developers.flatMap(d => Object.keys(d.skills)))];
    const skillMatrix = allSkillIds.map(skillId => {
      const skill = skills.find(s => s.id === skillId);
      return {
        skillId,
        skillName: skill?.name || skillId,
        category: skill?.category || 'Other',
        developers: developers.map(dev => ({
          name: dev.name,
          level: dev.skills[skillId] || 0
        }))
      };
    });

    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="px-4 py-3 text-left text-sm font-semibold">Skill</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                {developers.map(dev => (
                  <th key={dev.id} className="px-4 py-3 text-center text-sm font-semibold">
                    {dev.name.split(' ').map(n => n[0]).join('')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {skillMatrix.map((row, index) => (
                <tr key={row.skillId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.skillName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{row.category}</td>
                  {row.developers.map((devSkill, devIndex) => (
                    <td key={devIndex} className="px-4 py-3 text-center">
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getSkillLevelColor(devSkill.level)}`}>
                        {devSkill.level > 0 ? `${devSkill.level}%` : '-'}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white">
      <div className="bg-slate-800 shadow-lg p-6 border-b border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600">
              <Code className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Developer Skills Matrix</h1>
              <p className="text-sm text-gray-300">Team expertise and skill visualization</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search developers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-700 rounded-xl border-0 focus:ring-2 focus:ring-purple-500 text-white w-64"
              />
            </div>
            <button
              onClick={() => { fetchDevelopers(); fetchSkills(); }}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 rounded-xl hover:bg-slate-600"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowAddDeveloperModal(true)}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl"
            >
              <Plus className="h-5 w-5" />
              Add Developer
            </button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('heatmap')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'heatmap' ? 'bg-purple-600' : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            <Zap className="h-4 w-4" />
            Heatmap
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'cards' ? 'bg-purple-600' : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            <Users className="h-4 w-4" />
            Cards
          </button>
          <button
            onClick={() => setViewMode('matrix')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'matrix' ? 'bg-purple-600' : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Matrix
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Total Developers</span>
            <Users className="h-5 w-5 text-purple-400" />
          </div>
          <div className="text-3xl font-bold">{developers.length}</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Total Skills</span>
            <Star className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="text-3xl font-bold">{skills.length}</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Avg Utilization</span>
            <TrendingUp className="h-5 w-5 text-green-400" />
          </div>
          <div className="text-3xl font-bold">{Math.round(developers.reduce((acc, d) => acc + d.utilization, 0) / developers.length)}%</div>
        </div>
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Projects Active</span>
            <GitBranch className="h-5 w-5 text-blue-400" />
          </div>
          <div className="text-3xl font-bold">{developers.reduce((acc, d) => acc + d.projects, 0)}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {viewMode === 'heatmap' && <SkillsHeatmapView />}
        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {developers.map(developer => <DeveloperCard key={developer.id} developer={developer} />)}
          </div>
        )}
        {viewMode === 'matrix' && <SkillsMatrixView />}
      </div>

      {/* Add Developer Modal */}
      {showAddDeveloperModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-2xl w-full shadow-2xl border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-6">Add New Developer</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={newDeveloper.name}
                  onChange={(e) => setNewDeveloper({...newDeveloper, name: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={newDeveloper.email}
                  onChange={(e) => setNewDeveloper({...newDeveloper, email: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                <select
                  value={newDeveloper.role}
                  onChange={(e) => setNewDeveloper({...newDeveloper, role: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="developer">Developer</option>
                  <option value="senior_developer">Senior Developer</option>
                  <option value="tech_lead">Tech Lead</option>
                  <option value="qa_engineer">QA Engineer</option>
                  <option value="devops_engineer">DevOps Engineer</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl font-medium">Add Developer</button>
              <button onClick={() => setShowAddDeveloperModal(false)} className="flex-1 px-6 py-3 border border-slate-600 rounded-xl font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Developer;