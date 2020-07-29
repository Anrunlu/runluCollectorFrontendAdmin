const routes = [
  {
    path: "/login",
    component: () => import("pages/login.vue"),
    meta: { isPublic: true, title: "登录" }
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/dashboard",
        component: () => import("pages/user_management.vue"),
        meta: { title: "运行报表" }
      },
      {
        path: "/user_management",
        component: () => import("pages/user_management.vue"),
        meta: { title: "用户管理" }
      },
      {
        path: "/group_management",
        component: () => import("pages/group_management.vue"),
        meta: { title: "群组管理" }
      },
      {
        path: "/org_management",
        component: () => import("pages/org_management.vue"),
        meta: { title: "组织管理" }
      },
      {
        path: "/collections_management",
        component: () => import("pages/clt_management.vue"),
        meta: { title: "收集管理" }
      },
      {
        path: "/posts_management",
        component: () => import("pages/post_management.vue"),
        meta: { title: "文件管理" }
      },
      {
        path: "/push_notice",
        component: () => import("pages/send_notice.vue"),
        meta: { title: "发布公告" }
      },
      {
        path: "/feedback_management",
        component: () => import("pages/feedback_management.vue"),
        meta: { title: "用户反馈" }
      },
      {
        path: "/settings",
        component: () => import("pages/group_management.vue"),
        meta: { title: "系统设置" }
      }
    ]
  },
  {
    path: "/edit_notice/:id",
    component: () => import("pages/edit_notice.vue"),
    props: true,
    meta: { title: "编辑公告" }
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue")
  });
}

export default routes;
