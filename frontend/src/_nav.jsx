import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Puzzle,
  MousePointer,
  Calculator,
  PieChart,
  Bell
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const useNav = () => {
  const { t } = useTranslation();

  const _nav = [
    {
      type: "item",
      title: t("adminnav.Dashboard"),
      path: "/admin",
      icon: <LayoutDashboard size={20} />,
      badge: { text: t("adminnav.NEW"), variant: "info" }
    },
    {
      type: "title",
      title: t("adminnav.Components"),
    },
    {
      type: "group",
      title: t("adminnav.Master"),
      icon: <Puzzle size={20} />,
      path: "/base",
      items: [
        {
          type: "item",
          title: t("adminnav.Category"),
          path: "/admin/addcategory",
        },
        {
          type: "item",
          title: t("adminnav.SubCategory"),
          path: "/admin/addubcategory",
        },
        {
          type: "item",
          title: t("adminnav.Dish"),
          path: "/admin/adddish",
        },
        {
          type: "item",
          title: t("adminnav.View Dish"),
          path: "/admin/viewdish",
        },
        {
          type: "item",
          title: t("adminnav.Table"),
          path: "/admin/addtable",
        }
      ]
    },
    {
      type: "group",
      title: t("adminnav.Waiter"),
      icon: <MousePointer size={20} />,
      path: "",
      items: [
        {
          type: "item",
          title: t("adminnav.Waiter Registration"),
          path: "/admin/waiter-registration",
        },
        {
          type: "item",
          title: t("adminnav.Waiter Detail"),
          path: "/admin/viewwaiter",
        }
      ]
    },{
      type: "group",
      title: t("adminnav.Kitchen"),
      icon: <FileText size={20} />,
      path: "",
      items: [
        {
          type: "item",
          title: t("adminnav.Kitchen Registration"),
          path: "/admin/kitchen-register",
          },
        {
          type: "item",
          title: t("adminnav.Kitchen Detail"),
          path: "/admin/viewkitchen",
        }
      ]
    },
    {
      type: "item",
      title: "Order Details",
      icon: <Calculator size={20} />,
      path: "/admin/orderdetail",
      badge: { text: "", variant: "info" }
    }
  ];

  return _nav;
};

export default useNav;
