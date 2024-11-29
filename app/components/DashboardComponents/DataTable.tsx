import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table'
  
  const data = [
    { id: 1, name: 'Product A', category: 'Electronics', price: '$199.99', stock: 50 },
    { id: 2, name: 'Product B', category: 'Clothing', price: '$49.99', stock: 100 },
    { id: 3, name: 'Product C', category: 'Home & Garden', price: '$79.99', stock: 30 },
    { id: 4, name: 'Product D', category: 'Electronics', price: '$299.99', stock: 20 },
    { id: 5, name: 'Product E', category: 'Clothing', price: '$39.99', stock: 80 },
  ]
  
  export function DataTable() {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.price}</TableCell>
              <TableCell>{item.stock}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
  
  