import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from '@/components/ui/table'
  
  // an array of products
  const data = [
    { id: 1, name: 'Grape', category: 'Fruit Trees', price: 'M120.00', stock: 50 },
    { id: 2, name: 'Pine', category: 'Ornamental(Forest) Trees', price: 'M149.99', stock: 100 },
    { id: 3, name: 'Peach', category: 'Fruit Trees', price: 'M79.99', stock: 30 },
    { id: 4, name: 'Lemon', category: 'Fruit Trees', price: 'M99.00', stock: 20 },
    { id: 5, name: 'Rose', category: 'Flowers', price: 'M45.00', stock: 45 },
    { id: 6, name: 'Aloe', category: 'Medical Plants', price: 'M50.00', stock: 10 },
  ]
  
  export function DataTable() {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price Per Item</TableHead>
            <TableHead>Quantity</TableHead>
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
  
  