import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

interface StatsCardProps {
  title: string
  // value: string
  icon: React.ReactNode
  href: string
}

export function StatsCard({ title, icon, href }: StatsCardProps) {
  return (
    <Link href={href} passHref>
    <Card className="bg-blue-50">
      <CardHeader className="flex flex-col items-center justify-between space-y-0 pb-1">
       {icon}
        <CardTitle className="text-xl mt-4 font-medium p-3 text-green-600">{title}</CardTitle>
      </CardHeader>
      {/* <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent> */}
    </Card>
    </Link>
  )
}

