import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function RecentActivity() {
  const activities = [
    { id: 1, user: 'Thabo Makatle', action: 'Sold him 4 peach trees', time: '2 hours ago' },
    { id: 2, user: 'Lereko Halieo', action: 'Ordered 20 Lemon trees and paid for 15', time: '4 hours ago' },
    { id: 3, user: 'Bohlokoa Tholoana', action: 'SOld her 8 rose flower tree', time: '6 hours ago' },
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

