// _nav.js - Navigation configuration file
import {
  LayoutDashboard,
  FileText,
  Puzzle,
  MousePointer,
  Calculator,
  PieChart,
  Bell,
  Phone
} from 'lucide-react';

const Kitchen_nav = [
  {
    type: "item",
    title: "Dashboard",
    path: "/waiter",
    icon: <LayoutDashboard size={20} />,
    badge: { text: "NEW", variant: "info" }
  },
//   {
//     type: "title",
//     title: "Components",
//   },
//   {
//     type: "group",
//     title: "Master",
//     icon: <Puzzle size={20} />,
//     path: "/base",
//     items: [
    
//       {
//         type: "item",
//         title: "Category",
//         path: "/admin/addcategory",
//       },
//       {
//         type: "item",
//         title: "SubCategory",
//         path: "/admin/addubcategory",
//       },{
//         type: "item",
//         title: "Dish",
//         path: "/admin/adddish",
//       }
//     ]
//   },

//   {
//     type: "group",
//     title: "Waiter",
//     icon: <MousePointer size={20} />,
//     path: "",
//     items: [
//       {
//         type: "item",
//         title: "Waiter Registration",
//         path: "/admin/waiter-registration",
//       },
//       {
//         type: "item",
//         title: "Waiter Detail",
//         path: "/Agentview",
//       }
//     ]
//   },
//   {
//     type: "item",
//     title: "Customer Detail",
//     icon: <Calculator size={20} />,
//     path: "/Customerview",
//     badge: { text: "", variant: "info" }
//   },
//   {
//     type: "item",
//     title: "Customer Package Booking",
//     icon: <PieChart size={20} />,
//     path: "/ViewBookings",
//     badge: { text: "", variant: "info" }
//   },
//   {
//     type: "item",
//     title: "Customer Package Payment",
//     icon: <Puzzle size={20} />,
//     path: "/ViewPayment",
//     badge: { text: "", variant: "info" }
//   },
//   {
//     type: "item",
//     title: "Customer Training Schedule",
//     icon: <Bell size={20} />,
//     path: "/ViewSchedule",
//     badge: { text: "", variant: "info" }
//   },
//   {
//     type: "item",
//     title: "View Contact",
//     icon: <FileText size={20} />,
//     path: "/AContact",
//     badge: { text: "", variant: "info" }
//   }
];

export default Kitchen_nav;