import { createRouter, createWebHashHistory } from "vue-router";
const NotFound = () => import("@/views/NotFound.vue");
const HomePage = () => import("@/views/HomePage.vue");
const DataTable = () => import("@/views/DataTable.vue");
const Sketchpad = () => import("@/views/Sketchpad.vue");

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      redirect: "/Home",
    },
    {
      name: "Home",
      path: "/Home",
      component: HomePage,
      children: [
        {
          path: "",
          redirect: {
            name: "DataTable",
          },
        },
        {
          name: "DataTable",
          path: "/Home/DataTable",
          component: DataTable
        },
        {
          name: "Sketchpad",
          path: "/Home/Sketchpad",
          component: Sketchpad
        }
      ],
    },
    {
      name: "404",
      path: "/404",
      component: NotFound,
    },
    {
      path: "/:catchAll(.*)",
      redirect: {
        name: "404",
      },
    },
  ],
});

export default router;