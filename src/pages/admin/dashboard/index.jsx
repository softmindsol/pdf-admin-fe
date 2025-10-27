import { 
  MdConfirmationNumber, 
  MdPeople, 
  MdSupervisorAccount, 
  MdTrendingUp,
  MdAssignment,
  MdCheckCircle,
  MdPending,
  MdError
} from "react-icons/md";

export default function Dashboard() {
  // Sample data - replace with your actual data
  const dashboardStats = [
    {
      title: "Total Tickets",
      value: "2,847",
      change: "+12%",
      changeType: "increase",
      icon: MdConfirmationNumber,
      gradient: "from-orange-light to-orange-dark",
      bgGradient: "from-orange-50 to-orange-100",
      textColor: "text-orange-dark"
    },
    {
      title: "Total Workers",
      value: "156",
      change: "+3%",
      changeType: "increase",
      icon: MdPeople,
      gradient: "from-orange-300 to-orange-600",
      bgGradient: "from-orange-50 to-orange-200",
      textColor: "text-orange-700"
    },
    {
      title: "Managers",
      value: "24",
      change: "+1",
      changeType: "increase",
      icon: MdSupervisorAccount,
      gradient: "from-orange-400 to-orange-700",
      bgGradient: "from-orange-100 to-orange-200",
      textColor: "text-orange-800"
    },
    {
      title: "Revenue",
      value: "$89,247",
      change: "+18%",
      changeType: "increase",
      icon: MdTrendingUp,
      gradient: "from-orange-light to-orange-dark",
      bgGradient: "from-orange-50 to-orange-150",
      textColor: "text-orange-dark"
    },
    {
      title: "Open Tasks",
      value: "347",
      change: "-8%",
      changeType: "decrease",
      icon: MdAssignment,
      gradient: "from-orange-500 to-orange-800",
      bgGradient: "from-orange-100 to-orange-300",
      textColor: "text-orange-900"
    },
    {
      title: "Completed",
      value: "1,205",
      change: "+22%",
      changeType: "increase",
      icon: MdCheckCircle,
      gradient: "from-orange-300 to-orange-600",
      bgGradient: "from-orange-50 to-orange-200",
      textColor: "text-orange-700"
    },
    {
      title: "Pending Review",
      value: "89",
      change: "+5%",
      changeType: "increase",
      icon: MdPending,
      gradient: "from-orange-400 to-orange-700",
      bgGradient: "from-orange-100 to-orange-250",
      textColor: "text-orange-800"
    },
    {
      title: "Issues",
      value: "12",
      change: "-15%",
      changeType: "decrease",
      icon: MdError,
      gradient: "from-orange-600 to-orange-900",
      bgGradient: "from-orange-200 to-orange-400",
      textColor: "text-orange-900"
    }
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-light to-orange-dark bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-orange-dark/70 mt-2">Welcome back! Here's what's happening with your business today.</p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-orange-50 rounded-xl shadow-lg border border-orange-200/50 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-orange-dark/80 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-orange-dark mb-2">
                      {stat.value}
                    </p>
                    <div className="flex items-center">
                      <span
                        className={`text-sm font-medium ${
                          stat.changeType === 'increase' 
                            ? 'text-green-600' 
                            : 'text-red-500'
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-sm text-orange-dark/60 ml-1">
                        from last month
                      </span>
                    </div>
                  </div>
                  <div className={`bg-gradient-to-br ${stat.bgGradient} p-3 rounded-lg shadow-md`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Quick Actions Card */}
          <div className="bg-gradient-to-br from-white to-orange-50 rounded-xl shadow-lg border border-orange-200/50 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold bg-gradient-to-r from-orange-light to-orange-dark bg-clip-text text-transparent mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-orange-light/10 to-orange-dark/10 hover:from-orange-light/20 hover:to-orange-dark/20 rounded-lg transition-all duration-300 border border-orange-200/30">
                <span className="text-orange-dark font-medium">Create New Ticket</span>
                <MdConfirmationNumber className="w-5 h-5 text-orange-light" />
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-orange-light/10 to-orange-dark/10 hover:from-orange-light/20 hover:to-orange-dark/20 rounded-lg transition-all duration-300 border border-orange-200/30">
                <span className="text-orange-dark font-medium">Add New Worker</span>
                <MdPeople className="w-5 h-5 text-orange-light" />
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-orange-light/10 to-orange-dark/10 hover:from-orange-light/20 hover:to-orange-dark/20 rounded-lg transition-all duration-300 border border-orange-200/30">
                <span className="text-orange-dark font-medium">Generate Report</span>
                <MdTrendingUp className="w-5 h-5 text-orange-light" />
              </button>
            </div>
          </div>

          {/* Recent Activity Card */}
         
        </div>
      </div>
    </>
  );
}