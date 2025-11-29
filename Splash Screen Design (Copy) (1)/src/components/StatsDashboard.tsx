import { useState } from 'react';
import { ArrowLeft, Book, Clock, Heart, Sparkles, TrendingUp, Calendar, Share2, Award, Trophy, Target } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { toast } from '../utils/toast';

interface StatsDashboardProps {
  onBack: () => void;
  onViewStory?: (storyId: string) => void;
  onViewChild?: (childId: string) => void;
}

export function StatsDashboard({ onBack, onViewStory, onViewChild }: StatsDashboardProps) {
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('Last 30 days');
  const [activeTooltip, setActiveTooltip] = useState<any>(null);

  const timeRanges = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'All time'];

  // Key Insights
  const insights = [
    {
      id: '1',
      text: 'Reading time up 30% this week!',
      icon: TrendingUp,
      color: 'var(--brand-accent)',
      bgColor: 'rgba(179, 230, 197, 0.15)',
    },
    {
      id: '2',
      text: 'Adventure is your favorite theme',
      icon: Sparkles,
      color: 'var(--brand-enchant)',
      bgColor: 'rgba(200, 197, 255, 0.15)',
    },
  ];

  // Achievement Badges
  const badges = [
    {
      id: '1',
      title: '50 Stories',
      icon: Book,
      achieved: true,
      color: 'var(--brand-primary)',
    },
    {
      id: '2',
      title: '100 Hours',
      icon: Clock,
      achieved: false,
      color: 'var(--brand-secondary)',
    },
    {
      id: '3',
      title: 'Story Master',
      icon: Trophy,
      achieved: true,
      color: '#FFD700',
    },
  ];

  // Key KPIs for top cards
  const kpis = [
    {
      id: '1',
      icon: Book,
      value: '47',
      label: 'Total Stories',
      trend: '+12',
      trendUp: true,
      color: 'var(--brand-primary)',
      bgColor: 'rgba(125, 182, 248, 0.1)',
    },
    {
      id: '2',
      icon: Clock,
      value: '3.2h',
      label: 'Reading Time',
      trend: '+45m',
      trendUp: true,
      color: 'var(--brand-secondary)',
      bgColor: 'rgba(246, 166, 215, 0.1)',
    },
    {
      id: '3',
      icon: Heart,
      value: '32',
      label: 'Favorites',
      trend: '+8',
      trendUp: true,
      color: '#F6A6D7',
      bgColor: 'rgba(246, 166, 215, 0.1)',
    },
    {
      id: '4',
      icon: Sparkles,
      value: 'Adventure',
      label: 'Top Theme',
      trend: '18 stories',
      trendUp: false,
      color: 'var(--brand-enchant)',
      bgColor: 'rgba(200, 197, 255, 0.1)',
    },
  ];

  // Stories created over time (area chart data)
  const storiesOverTime = [
    { date: 'Nov 10', stories: 2 },
    { date: 'Nov 11', stories: 3 },
    { date: 'Nov 12', stories: 1 },
    { date: 'Nov 13', stories: 4 },
    { date: 'Nov 14', stories: 2 },
    { date: 'Nov 15', stories: 5 },
    { date: 'Nov 16', stories: 3 },
  ];

  // Theme distribution (bar chart data)
  const themeDistribution = [
    { theme: 'Adventure', count: 18, color: '#7DB6F8' },
    { theme: 'Fantasy', count: 12, color: '#C8C5FF' },
    { theme: 'Space', count: 9, color: '#7DB6F8' },
    { theme: 'Animals', count: 5, color: '#B3E6C5' },
    { theme: 'Friendship', count: 3, color: '#F6A6D7' },
  ];

  // Reading activity by day (area chart data)
  const readingActivity = [
    { day: 'Mon', minutes: 15 },
    { day: 'Tue', minutes: 22 },
    { day: 'Wed', minutes: 18 },
    { day: 'Thu', minutes: 30 },
    { day: 'Fri', minutes: 25 },
    { day: 'Sat', minutes: 35 },
    { day: 'Sun', minutes: 28 },
  ];

  const handleExportStats = () => {
    toast.info('Exporting stats', 'Your stats report will be downloaded shortly.');
  };

  const handleShareStats = () => {
    toast.info('Sharing stats', 'Opening share options...');
  };

  return (
    <div
      className="relative flex flex-col overflow-hidden"
      style={{
        width: '100%',
        maxWidth: 'var(--container-max-width)',
        minHeight: '100vh',
        backgroundColor: '#FAFAFB',
        margin: '0 auto',
      }}
    >
      {/* AppBar */}
      <div
        className="shrink-0"
        style={{
          backgroundColor: '#FFFFFF',
          boxShadow: 'var(--elevation-1)',
        }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={onBack}
            className="flex items-center justify-center transition-smooth hover:opacity-70"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--neutral-100)',
            }}
          >
            <ArrowLeft size={20} style={{ color: 'var(--text-primary)' }} />
          </button>

          <h2>Statistics</h2>

          <button
            onClick={handleShareStats}
            className="flex items-center justify-center transition-smooth hover:opacity-70"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--neutral-100)',
            }}
          >
            <Share2 size={20} style={{ color: 'var(--text-primary)' }} />
          </button>
        </div>

        {/* Prominent Time Range Selector */}
        <div className="px-6 pb-3">
          <button
            onClick={() => setShowFilterSheet(true)}
            className="w-full flex items-center justify-between transition-smooth active:scale-press"
            style={{
              height: '44px',
              paddingLeft: '16px',
              paddingRight: '16px',
              backgroundColor: 'rgba(125, 182, 248, 0.1)',
              border: '1px solid var(--brand-primary)',
              borderRadius: 'var(--radius-pill)',
            }}
          >
            <div className="flex items-center gap-2">
              <Calendar size={18} style={{ color: 'var(--brand-primary)' }} />
              <span
                style={{
                  fontSize: 'var(--text-body-sm)',
                  fontWeight: 'var(--weight-medium)',
                  color: 'var(--brand-primary)',
                }}
              >
                {selectedTimeRange}
              </span>
            </div>
            <TrendingUp size={18} style={{ color: 'var(--brand-primary)' }} />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
        {/* Key Insights Section */}
        <div className="mb-6">
          <h3 className="mb-3">Key Insights</h3>
          <div className="space-y-2">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="flex items-center gap-3 p-4 animate-fade-in"
                style={{
                  backgroundColor: insight.bgColor,
                  borderRadius: 'var(--radius-lg)',
                  border: `1px solid ${insight.color}33`,
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: insight.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <insight.icon size={20} style={{ color: 'white' }} />
                </div>
                <p
                  style={{
                    fontSize: 'var(--text-body-md)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {insight.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="mb-6">
          <h3 className="mb-3">Achievements</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className="shrink-0 transition-smooth active:scale-press"
                style={{
                  width: '100px',
                  padding: '16px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  textAlign: 'center',
                  opacity: badge.achieved ? 1 : 0.5,
                  border: badge.achieved ? `2px solid ${badge.color}` : '1px solid var(--neutral-200)',
                }}
              >
                <div
                  className="mx-auto mb-2"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: badge.achieved ? `${badge.color}22` : 'var(--neutral-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <badge.icon size={24} style={{ color: badge.color }} />
                </div>
                <p
                  style={{
                    fontSize: 'var(--text-caption)',
                    fontWeight: 'var(--weight-medium)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {badge.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* KPI Grid - 2x2 */}
        <div className="mb-6">
          <h3 className="mb-3">Overview</h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
            }}
          >
            {kpis.map((kpi) => (
              <div
                key={kpi.id}
                className="transition-smooth active:scale-press"
                style={{
                  padding: '16px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--elevation-1)',
                }}
              >
                <div
                  className="mb-3"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: kpi.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <kpi.icon size={20} style={{ color: kpi.color }} />
                </div>
                <h3
                  className="mb-1"
                  style={{
                    fontSize: '24px',
                    fontWeight: 'var(--weight-heading)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {kpi.value}
                </h3>
                <p
                  className="mb-2"
                  style={{
                    fontSize: 'var(--text-caption)',
                    color: 'var(--text-muted)',
                  }}
                >
                  {kpi.label}
                </p>
                {kpi.trend && (
                  <div className="flex items-center gap-1">
                    {kpi.trendUp && (
                      <TrendingUp size={14} style={{ color: 'var(--brand-accent)' }} />
                    )}
                    <span
                      style={{
                        fontSize: 'var(--text-caption)',
                        color: kpi.trendUp ? 'var(--brand-accent)' : 'var(--text-muted)',
                        fontWeight: 'var(--weight-medium)',
                      }}
                    >
                      {kpi.trend}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Stories Created Chart */}
        <div className="mb-6">
          <h3 className="mb-3">Stories Created</h3>
          <div
            style={{
              padding: '20px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--elevation-1)',
            }}
          >
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                data={storiesOverTime}
                onClick={(data) => {
                  if (data && data.activePayload) {
                    setActiveTooltip(data.activePayload[0].payload);
                  }
                }}
              >
                <defs>
                  <linearGradient id="colorStories" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7DB6F8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7DB6F8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  stroke="#E5E7EB"
                />
                <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} stroke="#E5E7EB" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '13px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="stories"
                  stroke="#7DB6F8"
                  strokeWidth={2}
                  fill="url(#colorStories)"
                  activeDot={{ r: 6, fill: '#7DB6F8' }}
                />
              </AreaChart>
            </ResponsiveContainer>
            {activeTooltip && (
              <div
                className="mt-3 p-2 text-center animate-fade-in"
                style={{
                  backgroundColor: 'rgba(125, 182, 248, 0.08)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <p
                  style={{
                    fontSize: 'var(--text-caption)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {activeTooltip.date}: {activeTooltip.stories} stories created
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Interactive Reading Activity Chart */}
        <div className="mb-6">
          <h3 className="mb-3">Reading Activity</h3>
          <div
            style={{
              padding: '20px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--elevation-1)',
            }}
          >
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={readingActivity}>
                <defs>
                  <linearGradient id="colorReading" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F6A6D7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F6A6D7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  stroke="#E5E7EB"
                />
                <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} stroke="#E5E7EB" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '13px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="minutes"
                  stroke="#F6A6D7"
                  strokeWidth={2}
                  fill="url(#colorReading)"
                  activeDot={{ r: 6, fill: '#F6A6D7' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Theme Distribution Chart */}
        <div className="mb-6">
          <h3 className="mb-3">Themes Distribution</h3>
          <div
            style={{
              padding: '20px',
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--elevation-1)',
            }}
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={themeDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="theme"
                  tick={{ fontSize: 11, fill: '#6B7280' }}
                  stroke="#E5E7EB"
                />
                <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} stroke="#E5E7EB" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '13px',
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#7DB6F8"
                  radius={[8, 8, 0, 0]}
                  onClick={(data) => {
                    toast.info(`${data.theme} theme`, `${data.count} stories in this theme.`);
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExportStats}
          className="w-full transition-smooth active:scale-press"
          style={{
            height: '48px',
            backgroundColor: '#FFFFFF',
            border: '2px solid var(--brand-primary)',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 'var(--weight-medium)',
            fontSize: 'var(--text-body-md)',
            color: 'var(--brand-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <Share2 size={18} />
          Export Report
        </button>
      </div>

      {/* Time Range Filter Sheet */}
      {showFilterSheet && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setShowFilterSheet(false)}
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <div
            className="absolute bottom-0 left-0 right-0"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              padding: '24px',
            }}
          >
            <h3 className="mb-4 text-center">Select Time Range</h3>

            <div className="space-y-2">
              {timeRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    setSelectedTimeRange(range);
                    setShowFilterSheet(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-4 transition-colors hover:bg-gray-50"
                  style={{
                    backgroundColor:
                      selectedTimeRange === range
                        ? 'rgba(125, 182, 248, 0.08)'
                        : 'transparent',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <span
                    style={{
                      fontSize: 'var(--text-body-md)',
                      color: 'var(--text-primary)',
                      fontWeight:
                        selectedTimeRange === range
                          ? 'var(--weight-medium)'
                          : 'var(--weight-regular)',
                    }}
                  >
                    {range}
                  </span>
                  {selectedTimeRange === range && (
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--brand-primary)',
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
