import { DashboardLayout } from '../DashboardComponents/DashboardLayout';
import Link from 'next/link';

export default function UsersPage() {
  // array of users
  const data = [
    {id: 1, firstName: "Thabo", lastName: "Leatla", status: "Active", UserType: "Admin", email: "thabo@gmail.com", phoneNumber: 6276237},
    {id: 2, firstName: "Makopano", lastName: "Phomolo", status: "Off", UserType: "Employee", email: "phomolo@gmail.com", phoneNumber: 57483443},
    {id: 3, firstName: "Lebekere", lastName: "Nala", status: "Active", UserType: "Employee", email: "thabo@gmail.com", phoneNumber: 6276237},
];
 
  return (
    <DashboardLayout>
        <div className="container mx-auto mt-10 p-0 max-w-7xl">
            <div className="flex  md:flex-row flex-row justify-between py-2">
            <h1 className="text-start mx-5 text-2xl font-bold">LNS Users </h1>
            {/* Seaerch input */}
            <div>
              <label >Search User</label>
              <input
              type='text'
              placeholder='user ID'
              className='border text-center mx-4 border-gray-400 rounded h-9'
              />
            </div>
            
            {/* action buttons to add user */}
            <div className="flex justify-end items-end mb-4 flex-col sm:flex-row">

                    <Link href={'/pages/Users/add'}
                    className="bg-gray-800 text-white text-lg px-6 mr-3  py-2 rounded-3xl shadow hover:bg-blue-700 transition duration-300 mb-4 sm:mb-0"
                    passHref>
                    + Add User
                    </Link>
                    {/*                     
                    onClick={() => handleDeleteAll(setHackathons, setFilteredHackathons)}
                    */}
                    <button
            
            className="bg-red-600 text-white p-4 mr-5 py-2 rounded-3xl shadow hover:bg-red-700 transition duration-300"
          >
            Delete All Users
          </button>
                
            </div>
            </div>
            <div className="overflow-x-auto mt-5 mx-5">
                {/* display the users in the form of table */}
                <table className="min-w-full table-auto border-collapse mb-6">                    
                       <thead>
                            <tr className="p-4 gap-x-8 bg-slate-300 rounded-t-xl">
                                <th className="px-4 py-2 text-start border">ID</th>
                                <th className="px-4 py-2 text-start border">First Name</th>
                                <th className="px-4 py-2 text-left border-r">Last Name</th>
                                <th className="px-4 py-2 text-left border-r">Status</th>
                                <th className="px-4 py-2 text-left border-r">User Type</th>
                                <th className="px-4 py-2 text-left border-r">Email</th>
                                <th className="px-4 py-2 text-left border-r">Phone Number</th>
                                <th className="px-4 py-2 text-left border-r">Actions</th>
                            </tr>
                        </thead>
 
                    <tbody>
                        {data.map((item) => 
                         <tr key={item.id}>
                         <td className="px-4 py-2 text-left border">{item.id}</td>
                         <td className="px-4 py-2 text-left border">{item.firstName}</td>
                         <td className="px-4 py-2 text-left border">{item.lastName}</td>
                         <td className="px-4 py-2 text-left border-b">{item.status}</td>
                         <td className="px-4 py-2 text-left border-b">{item.email}</td>
                         <td className="px-4 py-2 text-left border-b">{item.UserType}</td>
                         <td className="px-4 py-2 text-left border-b">{item.phoneNumber}</td>
                         <td className="px-4 py-2 text-left border-b">
                            <Link href={'/pages/users/details'} passHref className='text-blue-500'>
                            Details</Link>
                            <button className='ms-4 text-red-500'>
                              Delete</button>
                        </td>                         
                     </tr>
                        
                        )}
                       
                    </tbody>
                </table>

            </div>
        </div>
    </DashboardLayout>

  );
}
