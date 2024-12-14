import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function RecentActivity() {
  const activities = [
    { id: 1, user: 'John Doe', action: 'Created a new post', time: '2 hours ago' },
    { id: 2, user: 'Jane Smith', action: 'Updated their profile', time: '4 hours ago' },
    { id: 3, user: 'Bob Johnson', action: 'Commented on a post', time: '6 hours ago' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-green-600">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className=" text-black space-y-4 ">
          {activities.map((activity) => (
            <li key={activity.id} className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{activity.user}</p>
                <p className="text-sm text-gray-500">{activity.action}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </li>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

