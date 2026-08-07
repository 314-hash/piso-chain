"""
JobSync Engine for PISO Chain.
Inspired by Gsync/jobsync.

Provides Asynchronous AI Job Scheduling, Task Lifecycle Management,
Activity Execution Timers, and Node Capacity Matchmaking.
"""

import time
import hashlib
from typing import Dict, List, Any, Optional


class JobTask:
    """Represents a scheduled AI background job/task."""

    def __init__(self, task_id: str, name: str, category: str, priority: int = 1, payload: Optional[Dict[str, Any]] = None):
        self.task_id = task_id
        self.name = name
        self.category = category
        self.priority = priority
        self.payload = payload or {}
        self.status = "PENDING"  # PENDING, RUNNING, COMPLETED, FAILED
        self.created_at = time.time()
        self.started_at: Optional[float] = None
        self.completed_at: Optional[float] = None
        self.assigned_node: Optional[str] = None
        self.result: Optional[Dict[str, Any]] = None


class JobSyncEngine:
    """
    Asynchronous job scheduling and activity tracking engine for AI agent tasks,
    validator node workload distribution, and task timer logs.
    """

    def __init__(self):
        self.tasks: Dict[str, JobTask] = {}
        self.active_nodes = ["validator-manila-01", "validator-singapore-01", "validator-tokyo-01"]
        # Seed demo tasks
        self.schedule_job("Reentrancy Scan", "Contract Security Audit", priority=2)
        self.schedule_job("OSINT Threat Tracing", "Cyber Forensics", priority=1)

    def schedule_job(self, name: str, category: str, priority: int = 1, payload: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Schedule a new asynchronous job.
        """
        task_id = "JOB-" + hashlib.sha256(f"{name}-{time.time()}-{len(self.tasks)}".encode()).hexdigest()[:8]
        task = JobTask(task_id, name, category, priority, payload)
        self.tasks[task_id] = task

        # Auto assign node
        task.assigned_node = self.active_nodes[len(self.tasks) % len(self.active_nodes)]

        return {
            "task_id": task_id,
            "name": name,
            "category": category,
            "priority": priority,
            "assigned_node": task.assigned_node,
            "status": task.status,
            "created_at": task.created_at,
        }

    def run_task(self, task_id: str) -> Dict[str, Any]:
        """
        Simulate running a task and updating its status/timer.
        """
        if task_id not in self.tasks:
            return {"error": f"Task ID {task_id} not found"}

        task = self.tasks[task_id]
        task.status = "RUNNING"
        task.started_at = time.time()

        # Execute
        time.sleep(0.05)  # brief processing delay simulation
        task.completed_at = time.time()
        task.status = "COMPLETED"
        duration = round((task.completed_at - task.started_at) * 1000, 2)

        task.result = {
            "message": f"Task '{task.name}' completed successfully on node {task.assigned_node}.",
            "duration_ms": duration,
        }

        return {
            "task_id": task.task_id,
            "name": task.name,
            "status": task.status,
            "duration_ms": duration,
            "result": task.result,
        }

    def get_all_jobs(self) -> List[Dict[str, Any]]:
        """
        Get listing of all managed jobs with status and timing stats.
        """
        result = []
        for task in self.tasks.values():
            result.append({
                "task_id": task.task_id,
                "name": task.name,
                "category": task.category,
                "priority": task.priority,
                "status": task.status,
                "assigned_node": task.assigned_node,
                "created_at": task.created_at,
            })
        return result

    def get_queue_stats(self) -> Dict[str, Any]:
        """
        Get aggregated task statistics.
        """
        total = len(self.tasks)
        pending = sum(1 for t in self.tasks.values() if t.status == "PENDING")
        running = sum(1 for t in self.tasks.values() if t.status == "RUNNING")
        completed = sum(1 for t in self.tasks.values() if t.status == "COMPLETED")

        return {
            "total_tasks": total,
            "pending_tasks": pending,
            "running_tasks": running,
            "completed_tasks": completed,
            "active_worker_nodes": len(self.active_nodes),
            "scheduler_status": "ONLINE_ACTIVE",
        }
