export const getNavMenuList = (pathName: string) => {
  return [
    {
      id: "dashboard",
      label: "대시보드",
      href: "/dashboard",
      isActive: pathName.includes("/dashboard"),
      subMenus: [],
    },
    {
      id: "store-management",
      label: "매장관리",
      href: "/management/store",
      isActive: pathName.includes("/management/store"),
      subMenus: [],
    },
    {
      id: "brand-management",
      label: "브랜드관리",
      href: "/management/brand",
      isActive: pathName.includes("/management/brand"),
      subMenus: [],
    },
  ];
};
