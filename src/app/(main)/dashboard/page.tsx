import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Activity, Clock, Settings } from "lucide-react";
import Link from "next/link";
import { getAllWorkflows, getWorkflowExecutions } from "@/actions/workflows";
import { formatDistanceToNow } from "date-fns";

// Making this a server component to fetch data
const DashboardPage = async () => {
  // Fetch actual workflow data
  const workflows = await getAllWorkflows();

  // Calculate stats
  const activeWorkflows = workflows.filter((w) => w.lastExecuted).length;
  const completedTasks = workflows.reduce((acc, workflow) => {
    return acc + (workflow.executionCount || 0);
  }, 0);
  const totalProjects = workflows.length;

  // Get most recent workflows (limit to 3)
  const recentWorkflows = workflows
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-zinc-900 to-black p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <Button className="bg-zinc-700 hover:bg-zinc-600 text-white">
          <Settings className="mr-2 h-5 w-5" /> Settings
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: "Active Workflows",
            value: activeWorkflows.toString(),
            icon: Activity,
            color: "bg-zinc-800/90",
          },
          {
            title: "Completed Tasks",
            value: completedTasks.toString(),
            icon: Clock,
            color: "bg-zinc-800/90",
          },
          {
            title: "Workspace Usage",
            value:
              totalProjects > 0
                ? `${Math.min(Math.round((totalProjects / 50) * 100), 100)}%`
                : "0%",
            icon: BarChart3,
            color: "bg-zinc-800/90",
          },
          {
            title: "Total Projects",
            value: totalProjects.toString(),
            icon: BarChart3,
            color: "bg-zinc-800/90",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className={`${stat.color} shadow-md border-zinc-700 text-white`}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium text-zinc-400">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-5 w-5 text-zinc-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Projects */}
      <Card className="bg-zinc-800/90 border-zinc-700 text-white mb-8">
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentWorkflows.length > 0 ? (
              recentWorkflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className="flex justify-between items-center p-3 bg-zinc-700/50 rounded-md"
                >
                  <div>
                    <h3 className="font-medium">{workflow.name}</h3>
                    <p className="text-sm text-zinc-400">
                      {workflow.updatedAt
                        ? `Last edited ${formatDistanceToNow(
                            new Date(workflow.updatedAt)
                          )} ago`
                        : "Not edited yet"}
                    </p>
                  </div>
                  <Link href={`/workspace/editor/${workflow.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-zinc-300 hover:text-white hover:bg-zinc-600"
                    >
                      Open <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-3 text-zinc-400">
                No projects yet. Create your first workflow!
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-zinc-800/90 border-zinc-700 text-white">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/workspace/editor/new">
              <Button className="mb-2 w-full justify-start bg-zinc-700 hover:bg-zinc-600 text-white">
                <Activity className="mr-2 h-5 w-5" /> New Workflow
              </Button>
            </Link>
            <Button className="w-full justify-start bg-zinc-700 hover:bg-zinc-600 text-white">
              <BarChart3 className="mr-2 h-5 w-5" /> View Analytics
            </Button>
            <Link href="/workspace">
              <Button className="w-full justify-start bg-zinc-700 hover:bg-zinc-600 text-white">
                <Settings className="mr-2 h-5 w-5" /> Manage Workspaces
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-zinc-800/90 border-zinc-700 text-white h-fit">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">API</span>
                <span className="text-green-400 font-medium flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-400 mr-2"></span>
                  Operational
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Workflow Engine</span>
                <span className="text-green-400 font-medium flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-400 mr-2"></span>
                  Operational
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Storage</span>
                <span className="text-green-400 font-medium flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-400 mr-2"></span>
                  Operational
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
